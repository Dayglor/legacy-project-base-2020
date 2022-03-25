import { MajorityMember } from '@infrastructure/database/entities/MajorityMember';

export interface IMajorityMemberRepository {
	find(options: any): Promise<MajorityMember[]>;
	findById(id: string): Promise<MajorityMember>;
	findByUserId(userId: string): Promise<MajorityMember>;
	findByEmail(email: string): Promise<MajorityMember>;
	findByNationalRegistration(nationalRegistration: string): Promise<MajorityMember>;
	save(user: MajorityMember): Promise<MajorityMember>;
}
