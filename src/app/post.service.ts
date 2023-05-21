import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class PostService {
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
      .subscribe((response) => {
        console.log(response);
      });
  }
  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(
        "https://angular-ec29d-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json"
      )
      .pipe(
        map((responseData) => {
          const postArr: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArr.push({ ...responseData[key], id: key });
            }
          }
          return postArr;
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
