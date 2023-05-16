import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { VideoDto } from '../video-dto';
import { UserService } from '../user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'; // Ensure this import is correct

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css']
})
export class VideoCardComponent {
  @Input()
  video!: VideoDto;
  @Input()
  showDeleteButton: boolean = false;
  @Output()
  delete: EventEmitter<string> = new EventEmitter<string>();

  userEmail: string = '';

  constructor(private userService: UserService, public dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['video'] && this.video) {
      this.userService.getUserProfile(this.video.userId)
        .subscribe(userInfo => this.userEmail = userInfo.email.split('@').shift()!);
    }
  }

  getUserId(): string {
    return this.userService.getUserId();
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this video?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.delete.emit(this.video.id);
      }
    });
  }
}
