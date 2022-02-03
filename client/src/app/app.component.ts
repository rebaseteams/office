import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Form } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  src : string = "";
  connectionString = "";
  title = 'office-client';
  safeUrl : SafeResourceUrl | undefined;
  files : any;
  constructor(public sanitizer: DomSanitizer, private http : HttpClient) {}

  ngOnInit() {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }

  onGetFiles() {
    this.http.get('http://172.17.0.1:3000/wopi/files').subscribe((data : any) => {
      console.log(data);
      this.files = data;
    })
  }

  onCreateFile(name : string) {
    this.http.post(`http://172.17.0.1:3000/wopi/file?name=${name}`,undefined).subscribe((data : any) => {
      console.log(data);
    })
  }

  onConnect(file : string) {
    var wopiSrc : string = 'http://172.17.0.1:3000/wopi/collabora';
    this.http.get(wopiSrc).subscribe((data : any) => {
      console.log(data);
      var wopiUrl = data.url;
      var wopiToken = data.token;
      wopiUrl = `${wopiUrl}WOPISrc=http://172.17.0.1:3000/wopi/files/${file}?access_token=${wopiToken}`
      console.log(wopiUrl);
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(wopiUrl);
    });
  }
}
