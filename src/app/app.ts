import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JsonPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [JsonPipe, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('angular-v-21');
  http = inject(HttpClient);
  data: WritableSignal<any> = signal([]);
  email: string = ''
  otp: string = ''

  ngOnInit() {
  }

  signIn() {
    this.http.post('http://localhost:3000/auth/signin-otp', {email: this.email}).subscribe(res => {
      console.log(res)
    })
  }

  verifyOTP(){
    this.http.post('http://localhost:3000/auth/verify-signin-otp', {email: this.email, otp: this.otp}).subscribe(res => {
      console.log(res)
      localStorage.setItem('verify-otp-res', JSON.stringify(res))
    })
  }

  getTasks() {
    this.http.get('http://localhost:3000/api/tasks', {withCredentials: true}).subscribe({
      next: (res: any) => {
        this.data.set(res)
      }, error: () => {
        this.data.set([])
      }
    })
  }
}
