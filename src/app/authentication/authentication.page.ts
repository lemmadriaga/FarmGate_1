import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
  standalone: false,
})
export class AuthenticationPage implements AfterViewInit {
  constructor(private router: Router) {}

  ngAfterViewInit() {
    const sign_in_btn = document.querySelector('#sign-in-btn');
    const sign_up_btn = document.querySelector('#sign-up-btn');
    const container = document.querySelector('.container');

    if (sign_up_btn && container) {
      sign_up_btn.addEventListener('click', () => {
        container.classList.add('sign-up-mode');
      });
    }

    if (sign_in_btn && container) {
      sign_in_btn.addEventListener('click', () => {
        container.classList.remove('sign-up-mode');
      });
    }
  }

  tabs() {
    this.router.navigate(['tabs']);
  }
}
