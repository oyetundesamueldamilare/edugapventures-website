/* Interactive Portal & Widgets Script - EDUGAP Ventures Limited */

document.addEventListener('DOMContentLoaded', () => {
  initHubTabs();
  initCourseExplorer();
  initScholarshipWizard();
  initLagosMapInteractions();
  initContactForm();
});

/* 1. Hub Section Tabs Logic */
function initHubTabs() {
  const tabs = document.querySelectorAll('.hub-tab-btn');
  const panels = document.querySelectorAll('.hub-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      
      // Update active tab buttons
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active panel content
      panels.forEach(panel => {
        if (panel.id === target) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/* 2. IT Academy & Course Explorer Logic */
const COURSES_DATA = [
  {
    id: 1,
    title: 'Software Development Foundation',
    category: 'software',
    duration: '12 Weeks',
    level: 'Beginner to Intermediate',
    desc: 'Master coding essentials using Python and JavaScript. Learn database models, responsive designs, and core software engineering practices.',
    syllabus: [
      'Introduction to Programming Concepts',
      'HTML5, CSS3, & Modern JavaScript (ES6+)',
      'Backend Programming with Python & Express',
      'Database Foundations (SQL & NoSQL)',
      'Building & Deploying Full Stack Web Apps'
    ]
  },
  {
    id: 2,
    title: 'Computer Hardware & System Repair',
    category: 'hardware',
    duration: '8 Weeks',
    level: 'Beginner',
    desc: 'Get hands-on training in assembling, maintaining, troubleshooting, and diagnosing issues on computers, laptops, and peripheral systems.',
    syllabus: [
      'Computer Anatomy & Component Functions',
      'Assembling & Disassembling Hardware',
      'Operating System Installation & Driver Setup',
      'Diagnostic Utilities & Troubleshooting Methods',
      'Safety Procedures & Preventive Maintenance'
    ]
  },
  {
    id: 3,
    title: 'Advanced Computer Networking & Security',
    category: 'networking',
    duration: '10 Weeks',
    level: 'Intermediate to Advanced',
    desc: 'Understand how local and enterprise systems communicate. Covers router config, subnetting, network protocols, firewall management, and modern cybersecurity threat prevention.',
    syllabus: [
      'OSI Model & Network Topology Essentials',
      'IPv4 & IPv6 Subnetting & Routing Protocols',
      'Configuring Cisco Routers & Managed Switches',
      'Network Security: Firewalls, VPNs, & NAT',
      'Wireless Networking & Network Troubleshooting'
    ]
  },
  {
    id: 4,
    title: 'Digital Literacy & Computer Essentials',
    category: 'software',
    duration: '6 Weeks',
    level: 'Beginner',
    desc: 'A comprehensive starter course for educators, administration personnel, and students to build operational computer skills.',
    syllabus: [
      'Introduction to Computer OS (Windows/Linux)',
      'Cloud Productivity Software (G Suite / MS Office)',
      'Safe Browsing Practices & Digital Communications',
      'Introduction to Data Entry and Spreadsheets',
      'Digital Collaboration Tools'
    ]
  },
  {
    id: 5,
    title: 'IT Project & Business Administration',
    category: 'business',
    duration: '8 Weeks',
    level: 'Intermediate',
    desc: 'Bridge the gap between technology and commercial needs. Learn Agile workflows, business systems, data gathering, and project leading tools.',
    syllabus: [
      'Agile Frameworks & Scrum Methodologies',
      'Software Development Lifecycle (SDLC) Overview',
      'Requirements Gathering & Process Modeling',
      'Data Visualization & Basic Business Analytics',
      'Project Documentation & Delivery Management'
    ]
  }
];

function initCourseExplorer() {
  const searchInput = document.getElementById('courseSearch');
  const filterPills = document.querySelectorAll('.filter-pill');
  const coursesListContainer = document.getElementById('coursesList');
  
  let activeCategory = 'all';
  let searchQuery = '';

  // Render initial list
  renderCourses();

  // Search Input change
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderCourses();
  });

  // Category Pill Filter click
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-filter');
      renderCourses();
    });
  });

  // Render function
  function renderCourses() {
    coursesListContainer.innerHTML = '';
    
    const filteredCourses = COURSES_DATA.filter(course => {
      const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
      const matchesSearch = course.title.toLowerCase().includes(searchQuery) || 
                            course.desc.toLowerCase().includes(searchQuery);
      return matchesCategory && matchesSearch;
    });

    if (filteredCourses.length === 0) {
      coursesListContainer.innerHTML = `
        <div class="empty-state-message" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <p>No courses found matching your criteria. Try adjusting your search term.</p>
        </div>
      `;
      return;
    }

    filteredCourses.forEach(course => {
      const item = document.createElement('div');
      item.className = 'course-item';
      
      const syllabusListHtml = course.syllabus.map(topic => `<li>${topic}</li>`).join('');

      item.innerHTML = `
        <div class="course-item-header">
          <div class="course-meta">
            <span class="course-tag ${course.category}">${course.category}</span>
            <span class="course-duration">${course.duration} | ${course.level}</span>
          </div>
          <svg class="course-arrow-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
        <div class="course-title-row">
          <h3>${course.title}</h3>
          <p>${course.desc}</p>
        </div>
        <div class="course-details-panel">
          <strong>Curriculum Highlights:</strong>
          <ul class="course-syllabus-list">
            ${syllabusListHtml}
          </ul>
          <button class="btn btn-primary course-register-sim-btn" data-course="${course.title}">
            Secure Seat / Request Syllabus PDF
          </button>
        </div>
      `;

      // Accordion click trigger
      item.addEventListener('click', (e) => {
        // Prevent accordion trigger when clicking action button inside the panel
        if (e.target.closest('.course-register-sim-btn')) return;
        
        const isOpen = item.classList.contains('open');
        
        // Close all items first
        document.querySelectorAll('.course-item').forEach(el => el.classList.remove('open'));
        
        // Toggle current item
        if (!isOpen) {
          item.classList.add('open');
        }
      });

      // Simulation registration button click
      const regBtn = item.querySelector('.course-register-sim-btn');
      regBtn.addEventListener('click', () => {
        alert(`Thank you for your interest in the "${course.title}" course! A course specialist from EDUGAP Lagos will email the detailed brochure and registration form to you shortly.`);
      });

      coursesListContainer.appendChild(item);
    });
  }
}

/* 3. Scholarship & Funding Eligibility Checker Logic */
function initScholarshipWizard() {
  const panels = document.querySelectorAll('.wizard-panel');
  const steps = document.querySelectorAll('.wizard-step');
  const prevBtn = document.getElementById('wizardPrev');
  const nextBtn = document.getElementById('wizardNext');
  const progressBar = document.getElementById('wizardProgress');

  let currentStep = 0;
  let answers = {
    level: '',
    purpose: '',
    gpa: ''
  };

  // Option select triggers
  document.querySelectorAll('.wizard-panel .option-card').forEach(card => {
    card.addEventListener('click', () => {
      const panel = card.closest('.wizard-panel');
      const question = panel.getAttribute('data-question');
      const value = card.getAttribute('data-value');

      // Unselect siblings
      panel.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      answers[question] = value;
      
      // Auto-advance with small delay on options selection
      setTimeout(() => {
        if (currentStep < panels.length - 2) { // don't auto-advance at results or final details
          navigateSteps(1);
        }
      }, 300);
    });
  });

  // Nav buttons click
  prevBtn.addEventListener('click', () => navigateSteps(-1));
  nextBtn.addEventListener('click', () => navigateSteps(1));

  // Handle final submission inside results panel
  const claimBtn = document.getElementById('claimScholarshipBtn');
  if (claimBtn) {
    claimBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = document.getElementById('scholarshipEmail').value.trim();
      const phone = document.getElementById('scholarshipPhone').value.trim();

      if (!email || !phone) {
        alert('Please fill out all contact fields to submit your claim request.');
        return;
      }

      alert('Scholarship eligibility pre-approval saved! An EDUGAP Careers representative will contact you at ' + phone + ' with next steps.');
      resetWizard();
    });
  }

  function navigateSteps(direction) {
    // Basic validation before going forward
    if (direction === 1) {
      const currentPanel = panels[currentStep];
      const question = currentPanel.getAttribute('data-question');
      if (question && !answers[question]) {
        alert('Please select an option to proceed.');
        return;
      }
    }

    // Hide current panel
    panels[currentStep].classList.remove('active');
    
    // Update step index
    currentStep += direction;
    
    // Show next/prev panel
    panels[currentStep].classList.add('active');

    // Update wizard steps indicators (up to step 3 indicators)
    steps.forEach((step, idx) => {
      if (idx < currentStep) {
        step.className = 'wizard-step completed';
      } else if (idx === currentStep) {
        step.className = 'wizard-step active';
      } else {
        step.className = 'wizard-step';
      }
    });

    // Update progress bar width
    const pct = ((currentStep) / (panels.length - 1)) * 100;
    progressBar.style.width = `${pct}%`;

    // Handle button visibilities
    prevBtn.style.visibility = (currentStep === 0 || currentStep === panels.length - 1) ? 'hidden' : 'visible';
    
    if (currentStep === panels.length - 2) {
      // Calculate & display results
      calculateResults();
      nextBtn.style.display = 'none';
    } else if (currentStep === panels.length - 1) {
      nextBtn.style.display = 'none';
      prevBtn.style.display = 'none';
    } else {
      nextBtn.style.display = 'inline-flex';
    }
  }

  function calculateResults() {
    let baseFunding = 50; // default 50%
    
    // Adjust based on GPA
    if (answers.gpa === 'excellent') baseFunding += 30; // up to 80%
    else if (answers.gpa === 'good') baseFunding += 15;
    
    // Adjust based on purpose
    if (answers.purpose === 'need') baseFunding += 20; // 100% full-ride potential
    
    // Cap at 100%
    const finalFunding = Math.min(100, baseFunding);

    // Update HTML display
    const percentEl = document.getElementById('eligibilityPercentage');
    const descEl = document.getElementById('eligibilityDesc');
    
    percentEl.textContent = `${finalFunding}%`;
    
    if (finalFunding >= 90) {
      descEl.innerHTML = `Excellent standing! You qualify for a <strong>Full-Ride Merit & Need Scholarship</strong> covering tuition, technical course fees, and study material stipends.`;
    } else if (finalFunding >= 70) {
      descEl.innerHTML = `Great results! You qualify for a <strong>Partial Academic Scholarship (${finalFunding}%)</strong> to support your tuition fees and computer center access.`;
    } else {
      descEl.innerHTML = `You are eligible for a <strong>${finalFunding}% Education Bursary</strong> and book stipend for computer science and professional certification streams.`;
    }
  }

  function resetWizard() {
    // Reset answers
    answers = { level: '', purpose: '', gpa: '' };
    
    // Unselect selection boxes
    document.querySelectorAll('.wizard-panel .option-card').forEach(c => c.classList.remove('selected'));
    
    // Clear text inputs
    document.getElementById('scholarshipEmail').value = '';
    document.getElementById('scholarshipPhone').value = '';

    // Go to first step
    panels[currentStep].classList.remove('active');
    currentStep = 0;
    panels[currentStep].classList.add('active');

    // Reset steps
    steps.forEach((step, idx) => {
      step.className = idx === 0 ? 'wizard-step active' : 'wizard-step';
    });
    progressBar.style.width = '0%';
    
    prevBtn.style.visibility = 'hidden';
    nextBtn.style.display = 'inline-flex';
  }
}

/* 4. HQ Lagos Interactive Map Pin Detail Display */
const LOCATION_DATA = {
  lagos: {
    title: 'Nigeria Headquarters (Lagos)',
    desc: 'EDUGAP Ventures Central Operations & Tech Hub. Handles corporate coordination, scholarship funds distribution, and computer certifications.',
    address: 'Plot 15, Admiralty Way, Lekki Phase 1, Lagos, Nigeria.',
    phone: '+234 (1) 456-7890',
    email: 'lagos.hq@edugap.ng'
  },
  abuja: {
    title: 'North-Central Outreach Center (Abuja)',
    desc: 'Public literacy reading room, computer coaching center, and government partnerships coordinating terminal.',
    address: 'Suite 4, Capital Plaza, Central Business District, Abuja, Nigeria.',
    phone: '+234 (9) 987-6543',
    email: 'abuja.hub@edugap.ng'
  }
};

function initLagosMapInteractions() {
  const pins = document.querySelectorAll('.map-marker-pin');
  
  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      const locKey = pin.getAttribute('data-location');
      const data = LOCATION_DATA[locKey];

      if (!data) return;

      // Update Map Details panel HTML
      document.getElementById('mapActiveTitle').textContent = data.title;
      document.getElementById('mapActiveDesc').textContent = data.desc;
      document.getElementById('mapActiveAddress').textContent = data.address;
      document.getElementById('mapActivePhone').textContent = data.phone;
      document.getElementById('mapActiveEmail').textContent = data.email;

      // Pulse pin highlight
      pins.forEach(p => p.querySelector('.pin-circle').style.backgroundColor = 'var(--secondary-light)');
      pin.querySelector('.pin-circle').style.backgroundColor = 'var(--primary-light)';
    });
  });
}

/* 5. Contact Consultation Form Submission Mock */
function initContactForm() {
  const form = document.getElementById('consultationForm');
  const successOverlay = document.getElementById('formSuccessOverlay');
  const resetBtn = document.getElementById('formResetBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Trigger Success Panel overlay animation
    successOverlay.classList.add('active');
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    successOverlay.classList.remove('active');
  });
}
