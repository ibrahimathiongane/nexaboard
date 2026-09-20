import { z } from 'zod';

export const betaLeadSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Veuillez saisir une adresse e-mail professionnelle valide' }),
  teamSize: z.enum(['1-5', '6-10', '11-20', '20+'], {
    errorMap: () => ({ message: 'Veuillez indiquer la taille de votre équipe' }),
  }),
  currentTool: z.enum(['trello', 'notion', 'asana', 'clickup', 'other', 'none'], {
    errorMap: () => ({ message: 'Veuillez sélectionner votre outil actuel' }),
  }),
  interest: z
    .enum(['tasks', 'notes', 'calendar', 'all_in_one', 'cost_savings'])
    .optional(),
});

export type BetaLeadInput = z.infer<typeof betaLeadSchema>;
