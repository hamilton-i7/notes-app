import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { generateSampleNotes } from './utilities/sampleData';

describe('NotesService', () => {
  let service: NotesService;

  const mockNoteRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: getRepositoryToken(Note), useValue: mockNoteRepository },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all unarchived notes sorted by creation date (descending)', async () => {
      const notes = generateSampleNotes(4);
      notes[0].createdAt = new Date('2024-03-01');
      notes[1].createdAt = new Date('2024-03-10');
      notes[2].createdAt = new Date('2024-02-01');
      notes[3].archived = true;

      jest
        .spyOn(mockNoteRepository, 'find')
        .mockReturnValueOnce([notes[1], notes[0], notes[2]]);

      const result = await service.findAll();

      expect(mockNoteRepository.find).toHaveBeenCalledWith({
        where: { archived: false },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([notes[1], notes[0], notes[2]]);
    });

    it('should return an empty array', async () => {
      const notes = generateSampleNotes(4);
      for (let note of notes) {
        note.archived = true;
      }
      jest.spyOn(mockNoteRepository, 'find').mockReturnValueOnce([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });
});
