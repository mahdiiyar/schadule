// frontend/script.js
const correctUsername = "mahdiiyar";
const correctPassword = "";

document.getElementById("login-btn").addEventListener("click", () => {
    const u = document.getElementById("username").value;
    const p = document.getElementById("password").value;
    if (u === correctUsername && p === correctPassword) {
        document.getElementById("login-box").style.display = "none";
        document.getElementById("planner-box").style.display = "block";
        generateHourOptions();
        renderCalendar();
    } else {
        document.getElementById("login-error").innerText = "نام کاربری یا رمز اشتباه است!";
    }
});

function generateHourOptions() {
    const startHour = document.getElementById("start-hour");
    const endHour = document.getElementById("end-hour");

    for (let h = 5; h <= 24; h++) {
        const label = `${h}`;
        const option1 = document.createElement("option");
        const option2 = document.createElement("option");
        option1.value = option2.value = h;
        option1.textContent = option2.textContent = label;
        startHour.appendChild(option1);
        endHour.appendChild(option2);
    }
}


function renderCalendar() {
    const grid = document.getElementById("calendar-grid");
    const overlay = document.getElementById("calendar-overlay");
    grid.innerHTML = "";
    overlay.innerHTML = "";

    const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
    const hours = Array.from({ length: 20 }, (_, i) => i + 5); // 5 تا 24

    // ردیف ۰ = هدر ساعت‌ها
    const emptyHeader = document.createElement("div");
    emptyHeader.className = "header-cell";
    grid.appendChild(emptyHeader); // سلول خالی بالا سمت راست

    hours.forEach(hour => {
        const hourCell = document.createElement("div");
        hourCell.className = "header-cell";
        hourCell.textContent = `${hour}:00`;
        grid.appendChild(hourCell);
    });

    // روزها + سلول‌ها
    days.forEach((day, rowIndex) => {
        const rowLabel = document.createElement("div");
        rowLabel.className = "row-label";
        rowLabel.textContent = day;
        grid.appendChild(rowLabel);

        hours.forEach(() => {
            const cell = document.createElement("div");
            cell.className = "cell";
            grid.appendChild(cell);
        });
    });
}






// بقیه عملکرد مثل افزودن/حذف در مرحله بعد...

const activities = []; // برای نگهداری موقت فعالیت‌ها (در مرحله بعد می‌ره سرور)

document.getElementById("add-btn").addEventListener("click", () => {
    const day = document.getElementById("day").value;
    const task = document.getElementById("task").value;
    const color = document.getElementById("color").value;

    const startHour = parseInt(document.getElementById("start-hour").value);
    const startMinute = parseInt(document.getElementById("start-minute").value);
    const endHour = parseInt(document.getElementById("end-hour").value);
    const endMinute = parseInt(document.getElementById("end-minute").value);

    const startTime = startHour + startMinute / 60;
    const endTime = endHour + endMinute / 60;

    if (endTime <= startTime) {
        alert("ساعت پایان باید بعد از ساعت شروع باشد.");
        return;
    }

    const activity = {
        id: Date.now(),
        day,
        task,
        color,
        startTime,
        endTime,
    };

    activities.push(activity);
    drawActivity(activity);
    document.getElementById("task").value = "";
});


function drawActivity(activity) {
    const overlay = document.getElementById("calendar-overlay");

    const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
    const rowIndex = days.indexOf(activity.day);
    const start = activity.startTime;
    const end = activity.endTime;

    const hourWidth = 60;
    const rowHeight = 60;  // با CSS هماهنگ

    const hoursFromStart = start - 5;
    const width = (end - start) * hourWidth;

    const right = hoursFromStart * hourWidth;
    const top = 40 + rowIndex * rowHeight;

    const block = document.createElement("div");
    block.className = `activity-block ${activity.color}`;
    block.style.right = `${right + 100}px`;
    block.style.top = `${top}px`;
    block.style.width = `${width}px`;
    block.style.height = `${rowHeight}px`;

    block.innerHTML = `
    <div class="activity-title">${activity.task}</div>
    <div class="activity-time">${formatTime(start)} تا ${formatTime(end)}</div>
  `;

    block.onclick = () => {
        const sure = confirm("آیا مطمئنی که می‌خواهی این برنامه را حذف کنی؟");
        if (sure) removeActivity(activity.id);
    };

    overlay.appendChild(block);
}









function removeActivity(id) {
    const index = activities.findIndex(act => act.id === id);
    if (index !== -1) {
        activities.splice(index, 1);
        renderCalendar(); // تقویم رو از نو می‌سازیم
        activities.forEach(drawActivity); // و همه فعالیت‌ها رو مجدد می‌کشیم
    }
}

function formatTime(num) {
    const h = Math.floor(num);
    const m = (num - h) === 0.5 ? "30" : "00";
    return `${h}:${m}`;
}




