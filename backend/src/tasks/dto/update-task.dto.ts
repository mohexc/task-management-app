import { TaskStatus } from "../task.model";
import { IsEnum, IsOptional } from "class-validator";

export class UpdateTaskStatusDto {
    @IsEnum(TaskStatus)
    status: TaskStatus
}
export class UpdateTaskDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status: TaskStatus

    @IsOptional()
    title: string

    @IsOptional()
    description: string
}