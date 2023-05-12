import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../user.service';
import { CommentsService } from '../comments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentDto } from '../comment-dto';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent {

  @Input()
  videoId : string = '';
  commentsForm : FormGroup;
  commentsDto : CommentDto[] = [];

  constructor(private userService : UserService, private commentsService : CommentsService,
    private matSnackBar : MatSnackBar){

    this.commentsForm = new FormGroup({
      comment: new FormControl('comment'),
    });

  }

  ngOnInit() : void {
    this.getComments();
  }

  postComment(){
    const comment = this.commentsForm.get('comment')?.value;
    
    const commentDTO = {
      "commentText" : comment,
      "authorId" : this.userService.getUserId(),
    }

    this.commentsService.postComment(commentDTO, this.videoId).subscribe(()=>{
      this.matSnackBar.open("Comment Posted Successfully","OK");

      this.commentsForm.get('comment')?.reset(); // clear text area

      this.getComments(); //get comments and display
    });
  }

  getComments(){
    this.commentsService.getAllComments(this.videoId).subscribe(data => {
      this.commentsDto = data;
    });
  }

}
