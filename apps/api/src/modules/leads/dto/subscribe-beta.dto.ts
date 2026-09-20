import { IsEmail, IsIn, IsOptional } from 'class-validator';

export class SubscribeBetaDto {
  @IsEmail({}, { message: 'Email invalide' })
  email!: string;

  @IsIn(['1-5', '6-10', '11-20', '20+'], { message: 'Taille d’équipe invalide' })
  teamSize!: string;

  @IsIn(['trello', 'notion', 'asana', 'clickup', 'other', 'none'], {
    message: 'Outil actuel invalide',
  })
  currentTool!: string;

  @IsOptional()
  @IsIn(['tasks', 'notes', 'calendar', 'all_in_one', 'cost_savings'], {
    message: 'Centre d\'intérêt invalide',
  })
  interest?: string;
}
