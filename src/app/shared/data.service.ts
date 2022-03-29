import { Todo } from './todo.model';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  public endpoint = environment.url;
  public controller ='todos'
  constructor(private http: HttpClient) { }

  getAllTodos() {
    return this.http.get<Todo[]>(`${this.endpoint}/${this.controller}`);
  }

  getOne(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.endpoint}/${this.controller}/${id}`);
  }

   addTodo(todo: Todo) {
    return this.http.post<Todo>(`${this.endpoint}/${this.controller}`,todo);
  }

  updateTodo(id: string, todo: Todo): Observable<Todo>{
   return this.http.patch<Todo>(`${this.endpoint}/${this.controller}/${id}`,todo);
  }

  deleteTodo(id: string) {
   return this.http.delete<Todo>(`${this.endpoint}/${this.controller}/${id}`);
  }
}
