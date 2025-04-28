import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-educational-hub',
  templateUrl: './educational-hub.page.html',
  styleUrls: ['./educational-hub.page.scss'],
})
export class EducationalHubPage implements OnInit {
  educationalVideos = [
    // Beginner Level Videos
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
      title: 'Basic Soil Management',
      image: 'assets/education/soil.png',
      duration: '2 min',
      level: 'Beginner',
      youtubeUrl: 'https://www.youtube.com/watch?v=ZyWdU7DDsUQ',
      description: 'Learn the fundamentals of soil health and management',
    },
    {
      id: 3,
      title: 'Simple Irrigation Techniques',
      image: 'assets/education/irrigation.png',
      duration: '3 min',
      level: 'Beginner',
      youtubeUrl: 'https://www.youtube.com/watch?v=LfcFprFY9Ig',
      description: 'Basic irrigation methods for small farms',
    },

    // Intermediate Level Videos
    {
      id: 4,
      title: 'Sustainable Practices',
      image: 'assets/education/sustainable2.png',
      duration: '20 min',
      level: 'Intermediate',
      youtubeUrl: 'https://www.youtube.com/watch?v=iIqi3Fy2kXM',
      description: 'Discover sustainable farming methods for better yields',
    },
    {
      id: 5,
      title: 'Climate-Smart Farming',
      image: 'assets/education/climate.png',
      duration: '5 min',
      level: 'Intermediate',
      youtubeUrl: 'https://www.youtube.com/watch?v=g0wkT3mf80U',
      description: 'Adapt your farming practices to climate changes',
    },
    {
      id: 6,
      title: 'Crop Rotation Basics',
      image: 'assets/education/rotation.jfif',
      duration: '7 min',
      level: 'Intermediate',
      youtubeUrl: 'https://www.youtube.com/watch?v=XeNA6XdMoF8',
      description: 'Understanding crop rotation for soil health',
    },

    // Advanced Level Videos
    {
      id: 7,
      title: 'Pest Management',
      image: 'assets/education/pest2.png',
      duration: '4 min',
      level: 'Advanced',
      youtubeUrl: 'https://www.youtube.com/watch?v=AVSs-EkYTCo',
      description: 'Expert tips on managing pests in your farm',
    },
    {
      id: 8,
      title: 'Smart Greenhouse Technology',
      image: 'assets/education/greenhouse.jfif',
      duration: '8 min',
      level: 'Advanced',
      youtubeUrl: 'https://www.youtube.com/watch?v=peKuQovaL2E',
      description: 'Modern greenhouse systems for optimal crop growth',
    },
    {
      id: 9,
      title: 'Precision Agriculture Technology',
      image: 'assets/education/precision.jfif',
      duration: '4 min',
      level: 'Advanced',
      youtubeUrl: 'https://www.youtube.com/watch?v=3E8yHlGhEdk',
      description: 'Using data and technology for smarter farming decisions',
    }
  ];

  selectedLevel: string = 'all';
  searchTerm: string = '';

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
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
