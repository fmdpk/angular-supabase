import {Component, Inject, inject, OnInit, PLATFORM_ID, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {isPlatformBrowser, JsonPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [JsonPipe, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('angular-supabase');
  http = inject(HttpClient);
  data: WritableSignal<any> = signal([]);
  email: string = ''
  otp: string = ''
  supabaseSession: any
  private isBrowser: boolean = false

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(platformId)
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.supabaseSession = localStorage.getItem('verify-otp-res')
      console.log(this.supabaseSession)
    }
  }

  signIn() {
    if (!this.supabaseSession) {
      this.http.post('http://localhost:3000/auth/signin-otp', {email: this.email}).subscribe(res => {
        console.log(res)
      })
    } else {
      this.getTasks()
    }
  }

  verifyOTP() {
    if (!this.supabaseSession) {
      this.http.post('http://localhost:3000/auth/verify-signin-otp', {
        email: this.email,
        otp: this.otp
      }).subscribe(res => {
        console.log(res)
        this.supabaseSession = res
        localStorage.setItem('verify-otp-res', JSON.stringify(res))
      })
    } else {
      this.getTasks()
    }
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
