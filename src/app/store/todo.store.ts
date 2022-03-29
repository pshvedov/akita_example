import { EntityState, EntityStore, getIDType, StoreConfig } from '@datorama/akita';
import { Todo } from '../shared/todo.model';
import { Injectable } from '@angular/core';
import { DataService } from '../shared/data.service';
import { finalize, Observable } from 'rxjs';

export interface TodoState extends EntityState<Todo, Todo['id']> {
  stats: Record<string, number>;
}

export function createInitialTodoState(): TodoState {
  return {
    stats: null,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'todo', idKey: 'id' })
export class TodoStore extends EntityStore<TodoState> {
  constructor(private todoService: DataService) {
    super(createInitialTodoState());
    this.loadTodos();
  }

  private loadTodos(): void {
    this.setLoading(true);
    this.todoService.getAllTodos().pipe(
      finalize(() => this.setLoading(false)),
    ).subscribe((todos) => {
      this.set(todos);
    });
  }

  public toggleTodo(todo: Todo): void {
    this.load(this.todoService.updateTodo(todo.id, { ...todo, completed: !todo.completed }), (result) => {
      this.update(todo.id, result);
    });
  }

  public addTodo(todo: Todo): void {
    this.load(this.todoService.addTodo(todo), (result) => {
      this.add(result);
    });
  }

  public editTodo(todo: Todo): void {
    this.load(this.todoService.updateTodo(todo.id, todo), (result) => {
      this.update(todo.id, result);
    });
  }

  public deleteTodo(id: getIDType<TodoState>): void {
    this.load(this.todoService.deleteTodo(id), () => {
      this.remove(id);
    });
  }

  private load<T>(obs: Observable<T>, handler: (result: T) => void): void {
    this.setLoading(true);
    obs.pipe(
      finalize(() => this.setLoading(false))
    ).subscribe(handler);
  }
}

