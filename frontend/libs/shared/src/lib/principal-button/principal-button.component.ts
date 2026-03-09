import {Component, computed, input, output} from '@angular/core';
import {Principal} from "@open-booking/shared";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'lib-principal-button',
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './principal-button.component.html',
  styleUrl: './principal-button.component.scss',
})
export class PrincipalButtonComponent {

  principal = input.required<Principal>()
  logout = output<boolean>()

  readonly avatarColor = computed(() => {
    const colors = [
      'bg-indigo-600', 'bg-violet-600', 'bg-sky-600',
      'bg-emerald-600', 'bg-rose-600', 'bg-amber-600',
    ];
    const p = this.principal()
    if (!p) return colors[0]
    const index = p.given_name.charCodeAt(0) % colors.length
    return colors[index]
  })


  readonly initials = computed(() => {
    const p = this.principal()
    if (!p) return '?'
    return `${p.given_name.charAt(0)}${p.family_name.charAt(0)}`.toUpperCase()
  });

  readonly fullName = computed(() =>
    this.principal() ? `${this.principal()!.given_name} ${this.principal()!.family_name}` : ''
  )

  readonly email = computed(() => this.principal().email ?? '')
}
