class UserDataManager {
    constructor() {
        this.userContainer = document.getElementById('userContainer');
        this.errorMsg = document.getElementById('errorMsg');
        this.reloadBtn = document.getElementById('reloadBtn');
        this.loadingMsg = document.getElementById('loadingMsg');
        this.serverInfo = document.getElementById('serverInfo');
        this.stats = document.getElementById('stats');
        
        this.init();
    }
    
    init() {
        this.reloadBtn.addEventListener('click', () => this.fetchUserData());
        this.showServerInfo();
        this.fetchUserData();
    }
    
    async fetchUserData() {
        this.clearDisplay();
        this.showLoading(true);
        
        try {
            const response = await fetch('./data.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.showLoading(false);
            
            if (data.users && data.users.length > 0) {
                this.displayUsers(data.users);
                this.showStats(data.users.length);
                this.showSuccess(`✅ Successfully loaded ${data.users.length} users from data.json`);
            } else {
                throw new Error('No users found in data.json');
            }
            
        } catch (error) {
            this.showLoading(false);
            this.showError(`Failed to load data: ${error.message}`);
        }
    }
    
    displayUsers(users) {
        users.forEach(user => {
            const userCard = this.createUserCard(user);
            this.userContainer.appendChild(userCard);
        });
    }
    
    createUserCard(user) {
        const card = document.createElement('div');
        card.className = 'user-card';
        
        card.innerHTML = `
            <div class="user-id">#${user.id}</div>
            <h2>${user.name}</h2>
            <p><strong>📧 Email:</strong> ${user.email}</p>
            <p><strong>📞 Phone:</strong> ${user.phone}</p>
            <p><strong>🏠 Address:</strong> ${user.address.street}, ${user.address.city}</p>
            <p><strong>📮 Zipcode:</strong> ${user.address.zipcode}</p>
            <p><strong>🏢 Company:</strong> ${user.company.name}</p>
        `;
        
        return card;
    }
    
    showStats(userCount) {
        this.stats.innerHTML = `📊 Displaying ${userCount} users`;
    }
    
    showLoading(show) {
        this.loadingMsg.style.display = show ? 'flex' : 'none';
    }
    
    showError(message) {
        this.errorMsg.innerHTML = message;
        this.errorMsg.style.display = 'block';
    }
    
    showSuccess(message) {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-msg';
        successMsg.textContent = message;
        this.userContainer.parentNode.insertBefore(successMsg, this.userContainer);
        
        setTimeout(() => successMsg.remove(), 4000);
    }
    
    showServerInfo() {
        this.serverInfo.innerHTML = `
            <div class="server-info-box">
                <h3>🌐 Server Running Successfully!</h3>
                <p><strong>Project:</strong> Task 7 - User Data Fetch</p>
                <p><strong>Data Source:</strong> data.json</p>
                <p><strong>URL:</strong> ${window.location.href}</p>
            </div>
        `;
    }
    
    clearDisplay() {
        this.userContainer.innerHTML = '';
        this.errorMsg.style.display = 'none';
        this.errorMsg.innerHTML = '';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UserDataManager();
});
