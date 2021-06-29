import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { randomBytes } from 'crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { DeleteResult } from 'typeorm';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TasksRepository) private tasksRepository: TasksRepository) { }

    getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto)
    }

    async getTaskById(id: string): Promise<Task> {
        const task = await this.tasksRepository.findOne(id)
        if (!task) throw new NotFoundException(`Task with ID ${id} not found`)
        return task
    }

    createTask(createTaskDto: CreateTaskDto) {
        return this.tasksRepository.createTask(createTaskDto)
    }

    async deleteTask(id: string): Promise<DeleteResult> {
        await this.getTaskById(id)
        const result = await this.tasksRepository.delete(id)
        return result
    }

    async updateTaskById(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
        const { title, description, status } = updateTaskDto
        const foundTask = await this.getTaskById(id)
        if (title) {
            foundTask.description = description
        }
        if (description) {
            foundTask.title = title
        }
        if (status) {
            foundTask.status = status
        }
        const saveTask = await this.tasksRepository.save(foundTask)
        return saveTask
    }

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        const foundTask = await this.getTaskById(id)
        foundTask.status = status
        const saveTask = await this.tasksRepository.save(foundTask)
        return saveTask
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



//     updateTaskStatus(id: string, status: TaskStatus): Task {
//         const task = this.getTaskById(id)
//         task.status = status
//         const indexTask = this.tasks.findIndex(item => item.id === task.id)
//         this.tasks[indexTask] = task
//         return task
//     }