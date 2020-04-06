import { Component, OnInit } from '@angular/core';
import { ArticleService} from '../../services/article.service';
@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  pages:number;
  currentPage:number;
  public articles:any[];
  constructor(private articleService:ArticleService) {
    this.pages=1;
    this.currentPage=1;
   }

  ngOnInit(): void {
    this.articleService.getArticles(1).subscribe(
      (res)=>{
          this.articles=res.data.articles
          this.pages=res.data.pages;
      }, 
      (err) => {
        console.log(err);
      }
    );
  }
  public previousPage(){
      if(this.currentPage>1){
        this.articleService.getArticles(this.currentPage-1).subscribe(
          (res)=>{
              this.articles=res.data.articles
              this.pages=res.data.pages;
              this.currentPage--;
          }, 
          (err) => {
            console.log(err);
          }
        );
      }
  }
  public nextPage(){
    if(this.currentPage<this.pages){
      this.articleService.getArticles(this.currentPage+1).subscribe(
        (res)=>{
            this.articles=res.data.articles
            this.pages=res.data.pages;
            this.currentPage++;
        }, 
        (err) => {
          console.log(err);
        }
      );
    }
  }

}
