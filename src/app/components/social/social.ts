import { Component } from '@angular/core';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [],
  templateUrl: './social.html',
  styleUrl: './social.css',
})
export class Social {
  protected readonly items = [
    {
      name: 'Facebook',
      handle: '/adinova.studio',
      href: 'https://facebook.com',
    },
    {
      name: 'Instagram',
      handle: '@adinova.studio',
      href: 'https://instagram.com',
    },
    {
      name: 'LinkedIn',
      handle: '/company/adinova',
      href: 'https://linkedin.com',
    },
    {
      name: 'TikTok',
      handle: '@adinova.studio',
      href: 'https://tiktok.com',
    },
  ];
}
