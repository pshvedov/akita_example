import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import { DataService } from '../shared/data.service';
import { Todo } from '../shared/todo.model';

/**
 * This class represents todo components
 */
@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  public formTodo!: FormGroup;
  public todoList: Observable<Array<Todo>>;
  public list: Todo[] = [];

  constructor(
    private todoService: DataService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}

  public async ngOnInit(): Promise<void> {
    this.formTodo = this.formBuilder.group({
      textControl: new FormControl('', [Validators.required, Validators.minLength(4)]),
      idControl: new FormControl(),
      completedControl: new FormControl(),
      updateControl: new FormControl(),
    });

    this.todoList = this.todoService.getAllTodos();
    this.sortList();
  }

  public toggleCompleted(id: string, todo: Todo): void {
    todo.completed = !todo.completed;
    this.todoService.getOne(id).subscribe((a) => {
      todo =  a;
      todo.completed = !a.completed;
      todo.text = a.text;
      this.todoService.updateTodo(id, todo).subscribe(() => {
        this.sortList();
      });
    });
  }

  public addTodo(): void {
    let todoCreate: Todo = {
      text: this.formTodo.get('textControl')?.value,
      completed: false,
    }
    if (this.formTodo.valid) {
      this.todoService.addTodo(todoCreate).subscribe(() => {
        this.sortList();
      });
      this.formTodo.reset();
    }
  }

  public editTodo(todo: Todo): void {
    let dialogRef = this.dialog.open(EditModalComponent, {
      height: '200px', width: '600px',
      data: todo
    })
    dialogRef.afterClosed().subscribe((a) => {
      todo = a;
      this.todoService.updateTodo(a.id, todo).subscribe(() => {
        this.sortList();
      });
    });
  }

  public deleteTodo(id: string) {
    this.todoService.getOne(id).subscribe(() => {
      this.todoService.deleteTodo(id).subscribe(() => {
        this.sortList();
      });
    });
  }

  /**
  * This method sorted list for completed param
  */
  public sortList() {
    this.todoList?.subscribe((a) => {
      this.list = a;
      this.list.sort(function (x, y) {
        return (Number(x?.completed) - Number(y?.completed));
      });
    })
  }
}
