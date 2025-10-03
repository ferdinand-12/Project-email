    // PingMe Application
    const PingMe = {
      currentUser: function() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
      },

      setCurrentUser: function(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      },

      getAllUsers: function() {
        const usersStr = localStorage.getItem('users');
        return usersStr ? JSON.parse(usersStr) : [];
      },

      saveAllUsers: function(users) {
        localStorage.setItem('users', JSON.stringify(users));
      },

      logoutUser: function() {
        localStorage.removeItem('currentUser');
      },

      moveToTrash: function(emailId, fromFolder) {
        const users = this.getAllUsers();
        const currentUser = this.currentUser();
        
        if (!currentUser) return { success: false };

        const userIndex = users.findIndex(u => u.id === currentUser.id);
        const user = users[userIndex];

        const folderIndex = user.emails[fromFolder].findIndex(e => e.id === emailId);
        
        if (folderIndex !== -1) {
          const email = user.emails[fromFolder][folderIndex];
          user.emails[fromFolder].splice(folderIndex, 1);
          
          email.deletedFrom = fromFolder;
          email.deletedAt = new Date().toISOString();
          user.emails.trash.push(email);

          this.saveAllUsers(users);
          this.setCurrentUser(user);
          return { success: true };
        }

        return { success: false };
      },

      toggleStar: function(emailId, folder) {
        const users = this.getAllUsers();
        const currentUser = this.currentUser();
        
        if (!currentUser) return { success: false };

        const userIndex = users.findIndex(u => u.id === currentUser.id);
        const user = users[userIndex];

        const emailIndex = user.emails[folder].findIndex(e => e.id === emailId);
        
        if (emailIndex !== -1) {
          const email = user.emails[folder][emailIndex];
          email.isStarred = !email.isStarred;

          if (email.isStarred) {
            const starredCopy = {...email, originalFolder: folder};
            const existingIndex = user.emails.starred.findIndex(e => e.id === emailId);
            if (existingIndex === -1) {
              user.emails.starred.push(starredCopy);
            }
          } else {
            const starredIndex = user.emails.starred.findIndex(e => e.id === emailId);
            if (starredIndex !== -1) {
              user.emails.starred.splice(starredIndex, 1);
            }
          }

          this.saveAllUsers(users);
          this.setCurrentUser(user);
          return { success: true, isStarred: email.isStarred };
        }

        return { success: false };
      }
    };

    // Check if user is logged in
    const currentUser = PingMe.currentUser();
    if (!currentUser) {
      window.location.href = 'login.html';
    }

    // Update badge counts
    function updateBadges() {
      const user = PingMe.currentUser();
      document.getElementById('inboxCount').textContent = user.emails.inbox.length;
      document.getElementById('trashCount').textContent = user.emails.trash.length;
      document.getElementById('draftCount').textContent = user.emails.drafts.length;
    }

    // Logout handler
    document.getElementById('logoutBtn').addEventListener('click', function() {
      if (confirm('Are you sure you want to logout?')) {
        PingMe.logoutUser();
        window.location.href = 'index.html';
      }
    });

    let selectedEmailId = null;

    // Render email list
    function renderEmails(filter = '') {
      const emailList = document.getElementById('emailList');
      const user = PingMe.currentUser();
      
      if (!user || !user.emails.inbox) {
        emailList.innerHTML = '<li style="padding: 20px; text-align: center; color: #808080;">No messages</li>';
        return;
      }

      const inbox = user.emails.inbox;
      const filtered = inbox.filter(email => 
        (email.subject || '').toLowerCase().includes(filter.toLowerCase()) ||
        (email.from || '').toLowerCase().includes(filter.toLowerCase())
      );

      if (filtered.length === 0) {
        emailList.innerHTML = '<li style="padding: 20px; text-align: center; color: #808080;">No messages found</li>';
        return;
      }

      emailList.innerHTML = '';

      filtered.forEach(email => {
        const li = document.createElement('li');
        li.className = 'email-item';
        if (selectedEmailId === email.id) {
          li.classList.add('active');
        }

        const date = new Date(email.time);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        let formattedTime;
        if (diffDays === 0) {
          formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        } else if (diffDays < 7) {
          formattedTime = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
          formattedTime = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        const initial = email.from.charAt(0).toUpperCase();

        li.innerHTML = `
          <div style="display: flex; align-items: start; gap: 10px;">
            <div class="email-avatar">${initial}</div>
            <div style="flex: 1; min-width: 0;">
              <div class="email-item-header">
                <div class="email-from">${email.from.split('@')[0]}</div>
                <div class="email-time">${formattedTime}</div>
              </div>
              <div class="email-subject">${email.subject || '(no subject)'}</div>
              <div class="email-preview">${email.body}</div>
            </div>
          </div>
        `;

        li.addEventListener('click', function() {
          selectedEmailId = email.id;
          showEmailDetail(email);
          renderEmails(filter);
        });

        emailList.appendChild(li);
      });
    }

    // Show email detail
    function showEmailDetail(email) {
      document.getElementById('detailEmpty').style.display = 'none';
      document.getElementById('detailContent').classList.add('active');

      const date = new Date(email.time);
      const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      document.getElementById('detailSubject').textContent = email.subject || '(no subject)';
      document.getElementById('detailFrom').textContent = email.from;
      document.getElementById('detailTo').textContent = email.to || currentUser.email;
      document.getElementById('detailDate').textContent = formattedDate;
      document.getElementById('detailBody').textContent = email.body;

      const starBtn = document.getElementById('starBtn');
      starBtn.textContent = email.isStarred ? '★ Starred' : '☆ Star';
      starBtn.style.color = email.isStarred ? '#ffd700' : '#d4d4d4';

      // Update button handlers
      document.getElementById('replyBtn').onclick = () => {
        window.location.href = `reply.html?id=${email.id}&folder=inbox`;
      };

      document.getElementById('forwardBtn').onclick = () => {
        window.location.href = `compose.html?forward=${email.id}&folder=inbox`;
      };

      document.getElementById('deleteBtn').onclick = () => {
        if (confirm('Move this email to trash?')) {
          PingMe.moveToTrash(email.id, 'inbox');
          selectedEmailId = null;
          document.getElementById('detailEmpty').style.display = 'flex';
          document.getElementById('detailContent').classList.remove('active');
          renderEmails();
          updateBadges();
        }
      };

      document.getElementById('starBtn').onclick = () => {
        PingMe.toggleStar(email.id, 'inbox');
        const updatedUser = PingMe.currentUser();
        const updatedEmail = updatedUser.emails.inbox.find(e => e.id === email.id);
        if (updatedEmail) {
          showEmailDetail(updatedEmail);
        }
      };
    }

    // Search functionality
    document.getElementById('searchBox').addEventListener('input', function(e) {
      renderEmails(e.target.value);
    });

    // Initial render
    updateBadges();
    renderEmails();