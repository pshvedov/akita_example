import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import { DataService } from '../shared/data.service';
import { Todo } from '../shared/todo.model';
import { TodoQuery } from '../store/todo.query';
import { TodoStore } from '../store/todo.store';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],

})
export class TodosComponent implements OnInit {
  public formTodo!: FormGroup;
  public list$ = this.todoQuery.todos$;
  public isLoading$ = this.todoQuery.isLoading$;

  constructor(
    private todoService: DataService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private todoStore: TodoStore,
    private todoQuery: TodoQuery,
  ) {}

  public async ngOnInit(): Promise<void> {
    this.formTodo = this.formBuilder.group({
      textControl: new FormControl('', [Validators.required, Validators.minLength(4)]),
      idControl: new FormControl(),
      completedControl: new FormControl(),
      updateControl: new FormControl(),
    });
  }

  public toggleCompleted(todo: Todo): void {
    this.todoStore.toggleTodo(todo);
  }

  public addTodo(): void {
    let todoCreate: Todo = {
      text: this.formTodo.get('textControl')?.value,
      completed: false,
    }
    this.todoStore.addTodo(todoCreate);
    this.formTodo.reset();
  }

  public editTodo(todo: Todo): void {
    let dialogRef = this.dialog.open(EditModalComponent, {
      height: '200px', width: '600px',
      data: todo
    })
    dialogRef.afterClosed().subscribe((edited) => {
      this.todoStore.editTodo(edited);
    });
  }

  public deleteTodo(id: string) {
    this.todoStore.deleteTodo(id);
  }
}
