import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { TodoState, TodoStore } from './todo.store';

@Injectable({ providedIn: 'root' })
export class TodoQuery extends QueryEntity<TodoState> {
  public todos$ = this.selectAll({
    sortBy: 'completed',
  });

  public stats$ = this.select('stats');
  public isLoading$ = this.selectLoading();

  constructor(protected store: TodoStore) {
    super(store);
  }
}
