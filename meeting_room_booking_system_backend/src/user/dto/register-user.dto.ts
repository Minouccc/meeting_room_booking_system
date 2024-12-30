import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    description: '用户名',
    example: 'lisi',
  })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @ApiProperty({
    description: '昵称',
    example: '李四',
  })
  @IsNotEmpty({
    message: '昵称不能为空',
  })
  nickName: string;

  @ApiProperty({
    description: '密码',
    example: '333333',
    minLength: 6,
  })
  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于 6 位',
  })
  password: string;

  @ApiProperty({
    description: '邮箱',
    example: 'xxx@xx.com',
  })
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  email: string;

  @ApiProperty({
    description: '验证码',
    example: '123456',
  })
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
