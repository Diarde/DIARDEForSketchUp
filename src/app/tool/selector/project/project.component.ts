import { Component, OnInit } from '@angular/core';
import { ProjectloadService } from '../../services/projectload.service';
import { ProjectService } from '../../services/project.service';
import { Option, some, none, map } from 'fp-ts/lib/Option';
import * as Fuse from 'fuse.js';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  searchString = '';
  selected = null;
  dataSource = [];
  projects = [];
  fuse: Option<Fuse<any, any>> = none;

  constructor(
    private projectloadService: ProjectloadService,
    private projectService: ProjectService) {

    this.projectloadService.getProjects().then((projects) => {
      projects.forEach((project) => {
        this.projects.push({
          id: project._id,
          name: project.name,
          local: false,
        });
      });
      this.projects.sort((a, b) => a.name > b.name ? 1 : -1);
      this.dataSource = this.projects;

      const options = {
        keys: ['name', 'date'],
      };
      this.fuse = some(new Fuse(this.projects, options));
    });
  }

  ngOnInit() {}

  select(row) {
    this.selected = row;
    this.projectService.ProjectID = row.id;
  }

  keypress() {
    map((fuse) => {
      this.dataSource = this.searchString
        ? (fuse as any).search(this.searchString)
        : this.projects;
    })(this.fuse);
  }

}

