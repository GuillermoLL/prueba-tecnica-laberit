import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { UserCardComponent } from './user-card/user-card.component'
import { UsersService } from './users.service'
import { User } from './interface/User'
import { Subscription } from 'rxjs'
import { HttpClientModule } from '@angular/common/http'
import { UserEditModalComponent } from './user-edit-modal/user-edit-modal.component'
import { UserEditModalService } from './user-edit-modal/user-edit-modal.service'

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UserCardComponent, HttpClientModule, UserEditModalComponent],
  providers: [UsersService],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit, OnDestroy {
  usersList: User[] = []
  $subscriptions: Subscription[] = []
  loading = true

  constructor (private readonly usersService: UsersService, private readonly modalService: UserEditModalService) { }

  ngOnInit (): void {
    this.$subscriptions.push(
      this.usersService.getAllUser().subscribe((users) => { this.usersList = users; this.loading = false })
    )
  }

  public showCreateModal (): void {
    this.modalService.user.set({})
    this.modalService.toggleModal()
  }

  public nextPage (): void {
    if (this.usersService.page < this.usersService.totalPages) {
      this.loading = true
      this.$subscriptions.push(
        this.usersService.getAllUser(this.usersService.page + 1).subscribe(() => { this.loading = false })
      )
    }
  }

  public previusPage (): void {
    if (this.usersService.page > 1) {
      this.loading = true
      this.$subscriptions.push(
        this.usersService.getAllUser(this.usersService.page - 1).subscribe(() => { this.loading = false })
      )
    }
  }

  ngOnDestroy (): void {
    this.$subscriptions.forEach((sub) => sub.unsubscribe())
  }
}
