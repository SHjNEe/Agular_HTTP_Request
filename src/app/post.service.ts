import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map, catchError, tap } from "rxjs/operators";
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
        postData,
        {
          //Trả về toàn bộ response (Header + Body)
          // 1. Lấy thông tin header của response: Khi bạn muốn lấy thông tin về các header của response, chẳng hạn như `Content-Type`, `Content-Length`, `Date`,... thì việc sử dụng `observe: "response"` sẽ trả về toàn bộ thông tin này.
          // 2. Xử lý lỗi: Khi gửi một HTTP request và server trả về một mã lỗi, response sẽ bao gồm mã lỗi này trong header và body của response. Nếu bạn chỉ lấy nội dung của response mà không xử lý header, bạn sẽ không biết được lỗi là gì. Việc sử dụng `observe: "response"` sẽ giúp bạn xử lý lỗi một cách chính xác.
          // 3. Xử lý file: Khi tải file từ server, bạn có thể cần truy cập tới các header của response để lấy thông tin về loại file, kích thước, tên file,... Các thông tin này sẽ không có trong nội dung của response, mà chỉ có trong header.
          observe: "response",
        }
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
          //   Changing the Response Body Type
          responseType: "json",

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
    return this.http
      .delete(
        "https://angular-ec29d-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json",
        {
          observe: "events",
        }
      )
      .pipe(
        tap((event) => {
          if (event.type === HttpEventType.Sent) {
            // console.log(event.body);
          }
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}
