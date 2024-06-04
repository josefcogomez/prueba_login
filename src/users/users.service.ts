import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: UserDto): Promise<User> {
    try {
      const newUser = new this.userModel(createUserDto);
      return await newUser.save();
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new HttpException('Please check your credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  
  async getAllScore(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  async getScoresOrdered(): Promise<number[]> {
    try {
      const scores = await this.userModel.find().sort({ puntuacion: -1 }).select('puntuacion -_id').exec();
      if (!scores || scores.length === 0) {
        console.log('No scores found');
        throw new HttpException('No scores found', HttpStatus.NOT_FOUND);
      }
      console.log('Scores retrieved successfully:', scores);
      return scores.map(user => user.puntuacion);
    } catch (error) {
      console.error('Error retrieving scores:', error.message);
      throw new HttpException('Could not retrieve scores', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
