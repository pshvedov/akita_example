import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../shared/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() todoClicked: EventEmitter<void> = new EventEmitter();
  @Output() editClicked: EventEmitter<void> = new EventEmitter();
  @Output() removeClicked: EventEmitter<void> = new EventEmitter();

  onTodoClicked() {
    this.todoClicked.emit();
  }

  onEditTodoClicked() {
    this.editClicked.emit();
  }

  onRemoveTodoClicked() {
    this.removeClicked.emit();
  }
}
