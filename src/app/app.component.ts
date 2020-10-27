import { Component, OnInit } from '@angular/core';
import { TaskService } from './service/task.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private titleService: Title) {}
  ngOnInit() {
    this.titleService.setTitle('IBIGO');
  }
}
