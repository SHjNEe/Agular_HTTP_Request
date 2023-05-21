import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map, catchError } from "rxjs/operators";
import { Subject, throwError } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class PostService {
  error = new Subject<string>();
  constructor(private http: HttpClient) {}
  creteAndStorePost(title: string, content: string) {
    const postData: Post = {
      title,
      content,
    };
    this.http
      .post<{ name: string }>(
        "https://angular-ec29d-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json",
        postData
      )
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }
  fetchPosts() {
    let searchParam = new HttpParams();
    searchParam = searchParam.append("print", "pretty");
    searchParam = searchParam.append("status", "true");
    return this.http
      .get<{ [key: string]: Post }>(
        "https://angular-ec29d-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json",
        {
          headers: new HttpHeaders({ "Content-Type": "application/json" }),
          params: searchParam,
          //   params: new HttpParams().set("print", "pretty"),
        }
      )
      .pipe(
        map((responseData) => {
          //Handle return data
          const postArr: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArr.push({ ...responseData[key], id: key });
            }
          }
          return postArr;
        }),
        catchError((errors) => {
          //Handle errors
          console.log(errors);
          return throwError(errors);
        })
      );
    //   .subscribe((posts) => {
    //     console.log(posts);
    //   });
  }
  deletePosts() {
    return this.http.delete(
      "https://angular-ec29d-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json"
    );
  }
}
