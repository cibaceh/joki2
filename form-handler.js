// JokiTugaskuOfficial - Form Handler JavaScript
// Multi-step order form functionality

// Multi-step form variables
let currentStep = 1;
const totalSteps = 4;

// Multi-step form functions
function nextStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    
    // Validate current step
    if (!validateStep(currentStep)) {
        return;
    }

    currentStepElement.classList.remove('active');
    currentStep++;
    
    if (currentStep <= totalSteps) {
        document.getElementById(`step${currentStep}`).classList.add('active');
        updateProgressBar();
        
        if (currentStep === 4) {
            updateOrderSummary();
        }
    }
}

function prevStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    currentStepElement.classList.remove('active');
    currentStep--;
    
    if (currentStep >= 1) {
        document.getElementById(`step${currentStep}`).classList.add('active');
        updateProgressBar();
    }
}

function updateProgressBar() {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function validateStep(step) {
    const stepElement = document.getElementById(`step${step}`);
    const requiredFields = stepElement.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            isValid = false;
            
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
            
            // Reset border color after 3 seconds
            setTimeout(() => {
                field.style.borderColor = '#e2e8f0';
                field.style.boxShadow = 'none';
            }, 3000);
        } else {
            field.style.borderColor = '#10b981';
            field.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            
            // Reset success border after 2 seconds
            setTimeout(() => {
                field.style.borderColor = '#e2e8f0';
                field.style.boxShadow = 'none';
            }, 2000);
        }
    });

    // Additional validation for specific fields
    if (step === 1) {
        const whatsappField = document.getElementById('whatsapp');
        const emailField = document.getElementById('email');
        
        // Validate WhatsApp number
        if (whatsappField.value && !isValidPhoneNumber(whatsappField.value)) {
            whatsappField.style.borderColor = '#ef4444';
            utils.showNotification('Nomor WhatsApp tidak valid', 'error');
            isValid = false;
        }
        
        // Validate email if provided
        if (emailField.value && !utils.validateEmail(emailField.value)) {
            emailField.style.borderColor = '#ef4444';
            utils.showNotification('Format email tidak valid', 'error');
            isValid = false;
        }
    }
    
    if (step === 2) {
        const deadlineField = document.getElementById('deadline');
        const selectedDate = new Date(deadlineField.value);
        const minDate = new Date();
        minDate.setHours(minDate.getHours() + 2);
        
        if (selectedDate < minDate) {
            deadlineField.style.borderColor = '#ef4444';
            utils.showNotification('Deadline minimal 2 jam dari sekarang', 'error');
            isValid = false;
        }
    }
    
    if (step === 3) {
        const pricePackage = document.querySelector('input[name="pricePackage"]:checked');
        if (!pricePackage) {
            utils.showNotification('Mohon pilih paket harga', 'error');
            isValid = false;
        }
        
        const paymentProof = document.getElementById('paymentProof');
        if (paymentProof.files.length === 0) {
            paymentProof.style.borderColor = '#ef4444';
            utils.showNotification('Mohon upload bukti transfer', 'error');
            isValid = false;
        } else {
            // Validate file size (max 5MB)
            const file = paymentProof.files[0];
            if (file.size > 5 * 1024 * 1024) {
                paymentProof.style.borderColor = '#ef4444';
                utils.showNotification('Ukuran file maksimal 5MB', 'error');
                isValid = false;
            }
        }
    }

    if (!isValid) {
        if (firstInvalidField) {
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Shake animation for invalid step
        stepElement.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            stepElement.style.animation = '';
        }, 500);
    }

    return isValid;
}

function isValidPhoneNumber(phone) {
    const phoneRegex = /^(\+?62|0)[0-9]{8,13}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

function updatePriceOptions() {
    const taskType = document.getElementById('taskType').value;
    const urgency = document.getElementById('urgency').value;
    const priceCards = document.querySelectorAll('.price-card');

    // Base prices for different task types
    const basePrices = {
        'essay': { basic: 50000, premium: 100000, vip: 200000 },
        'math': { basic: 75000, premium: 150000, vip: 300000 },
        'presentation': { basic: 60000, premium: 120000, vip: 240000 },
        'programming': { basic: 100000, premium: 200000, vip: 400000 },
        'research': { basic: 150000, premium: 300000, vip: 600000 },
        'translation': { basic: 40000, premium: 80000, vip: 160000 },
        'thesis': { basic: 500000, premium: 1000000, vip: 2000000 },
        'other': { basic: 50000, premium: 100000, vip: 200000 }
    };

    // Urgency multipliers
    const urgencyMultipliers = {
        'normal': 1,
        'urgent': 1.5,
        'super-urgent': 2
    };

    if (taskType && basePrices[taskType]) {
        const multiplier = urgencyMultipliers[urgency] || 1;
        
        priceCards.forEach(card => {
            const packageType = card.dataset.price;
            const basePrice = basePrices[taskType][packageType];
            const finalPrice = Math.round(basePrice * multiplier);
            
            const priceElement = card.querySelector('.price');
            priceElement.textContent = `Rp ${finalPrice.toLocaleString('id-ID')}`;
            
            // Add visual feedback for price changes
            priceElement.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                priceElement.style.animation = '';
            }, 500);
        });
        
        // Show urgency indicator
        const urgencyIndicator = document.querySelector('.urgency-indicator');
        if (urgencyIndicator) urgencyIndicator.remove();
        
        if (multiplier > 1) {
            const indicator = document.createElement('div');
            indicator.className = 'urgency-indicator';
            indicator.style.cssText = `
                background: #f59e0b;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                text-align: center;
                margin: 1rem 0;
                font-weight: 600;
                animation: fadeInUp 0.3s ease;
            `;
            indicator.textContent = `⚡ Biaya urgency: +${Math.round((multiplier - 1) * 100)}%`;
            
            const priceOptions = document.getElementById('priceOptions');
            priceOptions.parentNode.insertBefore(indicator, priceOptions);
        }
    }
}

function updateOrderSummary() {
    const fullName = document.getElementById('fullName').value;
    const taskType = document.getElementById('taskType').value;
    const deadline = document.getElementById('deadline').value;
    const urgency = document.getElementById('urgency').value;
    const pricePackage = document.querySelector('input[name="pricePackage"]:checked');
    
    const taskTypeNames = {
        'essay': 'Essay & Artikel',
        'math': 'Matematika & Statistik',
        'presentation': 'Presentasi & Proposal',
        'programming': 'Programming & Coding',
        'research': 'Penelitian & Analisis',
        'translation': 'Translation & Proofreading',
        'thesis': 'Skripsi/Thesis',
        'other': 'Lainnya'
    };
    
    const urgencyNames = {
        'normal': 'Normal (>3 hari)',
        'urgent': 'Urgent (1-3 hari)',
        'super-urgent': 'Super Urgent (<24 jam)'
    };

    let summaryHTML = `
        <div class="summary-item">
            <span><strong>Nama:</strong></span>
            <span>${fullName}</span>
        </div>
        <div class="summary-item">
            <span><strong>Jenis Tugas:</strong></span>
            <span>${taskTypeNames[taskType] || taskType}</span>
        </div>
        <div class="summary-item">
            <span><strong>Deadline:</strong></span>
            <span>${new Date(deadline).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</span>
        </div>
        <div class="summary-item">
            <span><strong>Urgency:</strong></span>
            <span>${urgencyNames[urgency]}</span>
        </div>
    `;

    if (pricePackage) {
        const packageName = pricePackage.value.charAt(0).toUpperCase() + pricePackage.value.slice(1);
        const priceText = pricePackage.closest('.price-card').querySelector('.price').textContent;
        
        summaryHTML += `
            <div class="summary-item">
                <span><strong>Paket:</strong></span>
                <span>${packageName}</span>
            </div>
            <div class="summary-total">
                <span><strong>Total Harga:</strong></span>
                <span><strong>${priceText}</strong></span>
            </div>
        `;
    }

    document.getElementById('orderSummary').innerHTML = summaryHTML;
}

// Order form submission
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate final step
    if (!validateStep(4)) {
        return;
    }

    // Check if price package is selected
    const pricePackage = document.querySelector('input[name="pricePackage"]:checked');
    if (!pricePackage) {
        utils.showNotification('Mohon pilih paket harga terlebih dahulu!', 'error');
        return;
    }

    // Collect all form data
    const formData = new FormData(this);
    
    // Create detailed order message for WhatsApp
    const taskTypeNames = {
        'essay': 'Essay & Artikel',
        'math': 'Matematika & Statistik',
        'presentation': 'Presentasi & Proposal',
        'programming': 'Programming & Coding',
        'research': 'Penelitian & Analisis',
        'translation': 'Translation & Proofreading',
        'thesis': 'Skripsi/Thesis',
        'other': 'Lainnya'
    };
    
    const orderMessage = `🎯 *PESANAN BARU - JokiTugaskuOfficial*

📋 *INFORMASI PERSONAL*
• Nama: ${formData.get('fullName')}
• WhatsApp: ${formData.get('whatsapp')}
• Email: ${formData.get('email') || 'Tidak diisi'}

📝 *DETAIL TUGAS*
• Jenis: ${taskTypeNames[formData.get('taskType')] || formData.get('taskType')}
• Deskripsi: ${formData.get('taskDescription')}
• Deadline: ${new Date(formData.get('deadline')).toLocaleString('id-ID')}
• Tingkat Urgensi: ${document.getElementById('urgency').selectedOptions[0].text}

💰 *PAKET & PEMBAYARAN*
• Paket: ${pricePackage.value.toUpperCase()}
• Harga: ${pricePackage.closest('.price-card').querySelector('.price').textContent}
• Status Pembayaran: Bukti transfer sudah diupload

📎 *FILE & CATATAN*
• File tugas: ${formData.get('taskFiles').name || 'Tidak ada file'}
• Catatan tambahan: ${formData.get('additionalNotes') || 'Tidak ada'}

Mohon konfirmasi pesanan ini dan berikan informasi lebih lanjut. Terima kasih! 🙏`;

    // Show processing animation
    const submitBtn = document.querySelector('.btn-submit');
    const originalHTML = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    submitBtn.disabled = true;
    submitBtn.style.background = '#64748b';

    // Simulate processing time
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Pesanan Berhasil!';
        submitBtn.style.background = '#10b981';
        
        // Show success notification
        utils.showNotification('Pesanan berhasil dibuat!', 'success');
        
        setTimeout(() => {
            // Encode message for WhatsApp
            const encodedMessage = encodeURIComponent(orderMessage);
            const whatsappNumber = '6281234567890'; // Replace with actual number
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Open WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Show redirect notification
            utils.showNotification('Mengalihkan ke WhatsApp...', 'success');
            
            // Reset form after successful submission
            setTimeout(() => {
                resetOrderForm();
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                submitBtn.disabled = false;
            }, 3000);
            
        }, 2000);
    }, 1500);
});

function resetOrderForm() {
    // Reset form data
    document.getElementById('orderForm').reset();
    
    // Reset to first step
    currentStep = 1;
    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    document.getElementById('step1').classList.add('active');
    updateProgressBar();
    
    // Clear any validation styles
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.style.borderColor = '#e2e8f0';
        field.style.boxShadow = 'none';
    });
    
    // Reset price options to default
    document.querySelectorAll('.price-card .price').forEach((priceEl, index) => {
        const defaultPrices = ['Rp 50.000', 'Rp 100.000', 'Rp 200.000'];
        priceEl.textContent = defaultPrices[index] || 'Rp 50.000';
    });
    
    // Remove urgency indicator
    const urgencyIndicator = document.querySelector('.urgency-indicator');
    if (urgencyIndicator) urgencyIndicator.remove();
    
    utils.showNotification('Form berhasil direset', 'success');
}

// Set minimum datetime for deadline (current time + 2 hours)
document.addEventListener('DOMContentLoaded', function() {
    const deadlineInput = document.getElementById('deadline');
    if (deadlineInput) {
        const now = new Date();
        now.setHours(now.getHours() + 2);
        
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        deadlineInput.min = minDateTime;
        deadlineInput.value = minDateTime; // Set default value
    }
});

// Price card selection
document.querySelectorAll('.price-card').forEach(card => {
    card.addEventListener('click', function() {
        const radio = this.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;
            
            // Remove selection from other cards
            document.querySelectorAll('.price-card').forEach(otherCard => {
                if (otherCard !== this) {
                    otherCard.querySelector('input[type="radio"]').checked = false;
                }
            });
            
            // Add visual feedback
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        }
    });
});

// File upload handling
document.getElementById('paymentProof').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            utils.showNotification('Format file harus JPG atau PNG', 'error');
            this.value = '';
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            utils.showNotification('Ukuran file maksimal 5MB', 'error');
            this.value = '';
            return;
        }
        
        utils.showNotification(`Bukti transfer "${file.name}" berhasil diupload`, 'success');
        this.style.borderColor = '#10b981';
        
        // Reset border color after 2 seconds
        setTimeout(() => {
            this.style.borderColor = '#e2e8f0';
        }, 2000);
    }
});

document.getElementById('taskFiles').addEventListener('change', function() {
    const files = this.files;
    if (files.length > 0) {
        let totalSize = 0;
        let validFiles = 0;
        
        // Validate each file
        Array.from(files).forEach(file => {
            totalSize += file.size;
            
            // Check file size (max 10MB per file)
            if (file.size <= 10 * 1024 * 1024) {
                validFiles++;
            }
        });
        
        if (validFiles === files.length) {
            utils.showNotification(`${files.length} file berhasil diupload`, 'success');
            this.style.borderColor = '#10b981';
        } else {
            utils.showNotification('Beberapa file terlalu besar (max 10MB)', 'warning');
        }
        
        // Reset border color after 2 seconds
        setTimeout(() => {
            this.style.borderColor = '#e2e8f0';
        }, 2000);
    }
});

// WhatsApp number formatting
document.getElementById('whatsapp').addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    
    // Add country code if not present
    if (value.startsWith('8')) {
        value = '62' + value;
    } else if (value.startsWith('08')) {
        value = '62' + value.substring(1);
    }
    
    this.value = value;
    
    // Real-time validation feedback
    if (value && isValidPhoneNumber(value)) {
        this.style.borderColor = '#10b981';
    } else if (value) {
        this.style.borderColor = '#f59e0b';
    }
});

// Add shake animation CSS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Auto-save form data to prevent data loss (localStorage alternative)
let formAutoSaveData = {};

function autoSaveForm() {
    const formElements = document.querySelectorAll('#orderForm input, #orderForm select, #orderForm textarea');
    
    formElements.forEach(element => {
        if (element.type !== 'file' && element.name) {
            formAutoSaveData[element.name] = element.value;
        }
    });
}

function loadAutoSavedData() {
    Object.keys(formAutoSaveData).forEach(name => {
        const element = document.querySelector(`[name="${name}"]`);
        if (element && element.type !== 'file') {
            element.value = formAutoSaveData[name];
        }
    });
}

// Auto-save every 10 seconds
setInterval(autoSaveForm, 10000);

// Save on form interaction
document.getElementById('orderForm').addEventListener('change', autoSaveForm);
document.getElementById('orderForm').addEventListener('input', autoSaveForm);