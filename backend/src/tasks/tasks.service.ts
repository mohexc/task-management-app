import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { randomBytes } from 'crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = []

    getAllTasks() {
        return this.tasks
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const { status, search } = filterDto

        let tasks = this.tasks

        if (status) {
            tasks = tasks.filter((task) => task.status === status)
        }

        if (search) {
            tasks = tasks.filter((task) => (
                task.title.toLowerCase().includes(search.toLowerCase()) ||
                task.description.toLowerCase().includes(search.toLowerCase())
            ))
        }

        return tasks
    }

    getTaskById(id: string): Task {
        const task = this.tasks.find(task => task.id === id)
        return task
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto
        const id = randomBytes(6).toString('hex')
        const task: Task = {
            id,
            title,
            description,
            status: TaskStatus.OPEN,
        }
        this.tasks.push(task)
        return task
    }

    deleteTask(id: string): void {
        const task = this.tasks.filter(task => task.id !== id)
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id)
        task.status = status
        const indexTask = this.tasks.findIndex(item => item.id === task.id)
        this.tasks[indexTask] = task
        return task
    }
}