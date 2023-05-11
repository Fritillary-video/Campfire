import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent {

  commentsForm : FormGroup;

  constructor(private userService : UserService){
    this.commentsForm = new FormGroup({
      comment: new FormControl('comment'),
    });
  }

  ngOnInit() : void {

  }

  postComment(){
    const comment = this.commentsForm.get('comment')?.value;
    const commentDTO = {
      "commentText" : comment,
      "authorId" : this.userService.getUserId(),
    }
  }

}
