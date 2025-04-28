import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-educational-hub',
  templateUrl: './educational-hub.page.html',
  styleUrls: ['./educational-hub.page.scss'],
})
export class EducationalHubPage implements OnInit {
  educationalVideos = [
    {
      id: 1,
      title: 'Modern Rice Farming',
      image: 'assets/education/rice-farming.jpg',
      duration: '11 min',
      level: 'Beginner',
      youtubeUrl: 'https://www.youtube.com/watch?v=SJgDswVRuXA',
      description: 'Learn modern techniques for efficient rice farming',
    },
    {
      id: 2,
      title: 'Sustainable Practices',
      image: 'assets/education/sustainable2.png',
      duration: '20 min',
      level: 'Intermediate',
      youtubeUrl: 'https://www.youtube.com/watch?v=iIqi3Fy2kXM',
      description: 'Discover sustainable farming methods for better yields',
    },
    {
      id: 3,
      title: 'Pest Management',
      image: 'assets/education/pest2.png',
      duration: '4 min',
      level: 'Advanced',
      youtubeUrl: 'https://www.youtube.com/watch?v=AVSs-EkYTCo',
      description: 'Expert tips on managing pests in your farm',
    },
    {
      id: 4,
      title: 'Organic Fertilizers',
      image: 'assets/education/organic-fertilizer.jpg',
      duration: '15 min',
      level: 'Intermediate',
      youtubeUrl: 'https://www.youtube.com/watch?v=xWlWkOGGBNc',
      description: 'Make your own organic fertilizers',
    },
    {
      id: 5,
      title: 'Water Management',
      image: 'assets/education/water-management.jpg',
      duration: '8 min',
      level: 'Beginner',
      youtubeUrl: 'https://www.youtube.com/watch?v=JweJGN6WR8E',
      description: 'Efficient water management techniques',
    },
    {
      id: 6,
      title: 'Crop Rotation',
      image: 'assets/education/crop-rotation.jpg',
      duration: '12 min',
      level: 'Intermediate',
      youtubeUrl: 'https://www.youtube.com/watch?v=ki5IsX6YJPg',
      description: 'Understanding crop rotation benefits',
    }
  ];

  selectedLevel: string = 'all';
  searchTerm: string = '';

  constructor() { }

  ngOnInit() {
  }

  openYoutubeVideo(url: string): void {
    window.open(url, '_blank');
  }

  get filteredVideos() {
    return this.educationalVideos
      .filter(video => 
        this.selectedLevel === 'all' || video.level.toLowerCase() === this.selectedLevel.toLowerCase()
      )
      .filter(video =>
        video.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  }

  filterByLevel(level: string) {
    this.selectedLevel = level;
  }
}
