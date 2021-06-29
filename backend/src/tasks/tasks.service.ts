import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { randomBytes } from 'crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TasksRepository) private tasksRepository: TasksRepository) { }

    async getTasks() {

    }

    async getTaskById(id: string): Promise<Task> {
        const task = await this.tasksRepository.findOne({ id })
        if (!task) throw new NotFoundException(`Task with ID ${id} not found`)
        return task
    }

    async getTasksWithFilters() {

    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto
        const crateTask = this.tasksRepository.create({ title, description, status: TaskStatus.OPEN })
        const newTask = await this.tasksRepository.save(crateTask)
        return newTask
    }

    async deleteTask() {

    }

    async updateTaskById() {

    }

    async updateTaskStatus() {

    }

}

// private tasks: Task[] = []

//     getAllTasks() {
//         return this.tasks
//     }

//     getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
//         const { status, search } = filterDto

//         let tasks = this.tasks

//         if (status) {
//             tasks = tasks.filter((task) => task.status === status)
//         }

//         if (search) {
//             tasks = tasks.filter((task) => (
//                 task.title.toLowerCase().includes(search.toLowerCase()) ||
//                 task.description.toLowerCase().includes(search.toLowerCase())
//             ))
//         }

//         return tasks
//     }

//     getTaskById(id: string): Task {
//         const task = this.tasks.find(task => task.id === id)

//         if (!task) {
//             throw new NotFoundException(`Task with ID ${id} not found`)
//         }

//         return task
//     }

//     createTask(createTaskDto: CreateTaskDto): Task {
//         const { title, description } = createTaskDto
//         const id = randomBytes(6).toString('hex')
//         const task: Task = {
//             id,
//             title,
//             description,
//             status: TaskStatus.OPEN,
//         }
//         this.tasks.push(task)
//         return task
//     }

//     deleteTask(id: string): void {
//         const found = this.getTaskById(id)
//         this.tasks = this.tasks.filter(task => task.id !== found.id)
//     }

//     updateTaskStatus(id: string, status: TaskStatus): Task {
//         const task = this.getTaskById(id)
//         task.status = status
//         const indexTask = this.tasks.findIndex(item => item.id === task.id)
//         this.tasks[indexTask] = task
//         return task
//     }