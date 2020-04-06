import { Component, OnInit } from '@angular/core';
import { ArticleService} from '../../services/article.service';
@Component({
  selector: 'app-readlater',
  templateUrl: './readlater.component.html',
  styleUrls: ['./readlater.component.scss']
})
export class ReadlaterComponent implements OnInit {

  public articles:any[];
  constructor(private articleService:ArticleService) { }

  ngOnInit(): void {
    this.articleService.getReadlater().subscribe(
      (res)=>{
          this.articles=res.data;
      }, 
      (err) => {
        console.log(err);
      }
    );
  }
  removeArticle(article){
    this.articleService.toggleReadlater(article._id).subscribe(
      (res)=>{
        console.log(res.message);
        this.articles = this.articles.filter(a=>a._id!==article._id);
      },
      (err)=>{
        console.log(err)
      }
    );
  }

}
