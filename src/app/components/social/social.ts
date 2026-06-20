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
      handle: '/adinovaestudioarquitectonico',
      href: 'https://www.facebook.com/profile.php?id=100083355670332',
    },
    {
      name: 'Instagram',
      handle: '@adinovaestudioarquitectonico',
      href: 'https://www.instagram.com/adinovaestudioarquitectonico/',
    },
    {
      name: 'TikTok',
      handle: '@adinovaarq',
      href: 'https://www.tiktok.com/@adinovaarq?_r=1&_t=ZS-96sRdeOBdzz',
    },
    {
      name: 'WhatsApp',
      handle: '+593 98 409 0397',
      href: 'https://wa.me/593984090397',
    },
  ];
}
