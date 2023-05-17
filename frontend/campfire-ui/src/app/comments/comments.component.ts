import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../user.service';
import { CommentsService } from '../comments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentDto } from '../comment-dto';
import { OidcSecurityService } from 'angular-auth-oidc-client';

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
  isAuthenticated: boolean = false;

  constructor(private userService : UserService, private commentsService : CommentsService,
    private matSnackBar : MatSnackBar, private oidcSecurityService: OidcSecurityService){

    this.commentsForm = new FormGroup({
      comment: new FormControl(''),
    });

  }

  ngOnInit() : void {
    this.oidcSecurityService.isAuthenticated$.subscribe(({isAuthenticated}) => {
      this.isAuthenticated = isAuthenticated;
  })
    this.getComments();
  }

  postComment(){
    const comment = this.commentsForm.get('comment')?.value;
    
    const commentDTO = {
      "commentId" : "",
      "text" : comment,
      "authorId" : this.userService.getUserId(),
      "authorName" : "",
      "likeCount" : 0,
      "dislikeCount" : 0,
      "datePosted" : new Date().toLocaleDateString(),
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

  deleteComment(commentId: string) {
    this.commentsService.deleteComment(this.videoId, commentId).subscribe(() => {
      this.matSnackBar.open("Comment Deleted Successfully", "OK");
      this.getComments(); // get comments and display
    });
  }

  checkDelete(comment : CommentDto) : boolean{
    return comment.authorId ===  this.userService.getUserId();
  }
}
