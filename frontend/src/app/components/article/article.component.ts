import { Component, OnInit,Input , EventEmitter,Output} from '@angular/core';
import{AuthService} from '../../services/auth.service';
import { Router } from '@angular/router';
import {ArticleService } from '../../services/article.service';
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  @Input() article:any;
  @Output() removeArticle :EventEmitter<any> = new EventEmitter();
 
  liked:boolean
  readlater:boolean;
  constructor(public authService : AuthService,private router:Router,private articleService:ArticleService) {
  }

  ngOnInit(): void {
   
    this.liked=false;
    this.readlater=false;
    if(this.authService.loggedIn()){
      this.liked = this.article.liked;
      this.readlater=this.article.readlater;
    }
  
  }
  toggleLike(){
    if(this.authService.loggedIn()){
      this.articleService.toggleLike(this.article._id).subscribe(
        (res)=>{
          console.log(res.message);
          this.article.liked=!this.article.liked;
          this.liked=!this.liked;
        },
        (err)=>{
          console.log(err)
        }
      );
    }
    else{
      this.router.navigate(['/login']);
    }
  }
  toggleReadlater(){
    if(this.authService.loggedIn()){
      this.articleService.toggleReadlater(this.article._id).subscribe(
        (res)=>{
          console.log(res.message);
          this.article.readlater=!this.article.readlater
          this.readlater=!this.readlater;
            this.removeArticle.emit(this.article);
          
        },
        (err)=>{
          console.log(err)
        }
      );
    }
    else{
      this.router.navigate(['/login']);
    }
  }

}
