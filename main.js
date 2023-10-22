function formatFileSize(size) {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (size < KB) {
    return size + " B";
  } else if (size < MB) {
    return (size / KB).toFixed(2) + " KB";
  } else if (size < GB) {
    return (size / MB).toFixed(2) + " MB";
  } else {
    return (size / GB).toFixed(2) + " GB";
  }
}

// const token = TOKEN

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github+json"
};

async function getCategorys() {
  const response = await fetch("https://api.github.com/repos/zyr0z/img-host/contents/", {
    method: "GET",
    headers: headers
  });
  const data = await response.json();

  data.forEach((element) => {
    if (element.type === "dir") {
      getFile(element.name);
    }
  });
}

async function getFile(category) {
  const response = await fetch(`https://api.github.com/repos/zyr0z/img-host/contents/${category}`, {
    method: "GET",
    headers: headers
  });
  const data = await response.json();

  const imageElement = document.getElementById("images");

  const categoryHeader = document.createElement("h2");
  categoryHeader.textContent = category.toUpperCase();

  const categoryElement = document.createElement("ul");

  data.forEach((file) => {
    if (file.type === "file" && file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      const li = document.createElement("li");

      const a = document.createElement("a");
      a.href = `/${category}/${file.name}`;
      a.textContent = `/${category}/${file.name}`;
      a.target = "_blank";

      const fileInfos = document.createElement("div");

      const fileSize = document.createElement("p");
      fileSize.textContent = `Size: ${formatFileSize(file.size)}`;

      const fileHash = document.createElement("p");
      fileHash.textContent = `Hash: ${file.sha}`;

      fileInfos.appendChild(fileSize);
      fileInfos.appendChild(fileHash);

      li.appendChild(a);
      li.appendChild(fileInfos);

      categoryElement.appendChild(li);
    }
  });

  imageElement.appendChild(categoryHeader);
  imageElement.appendChild(categoryElement);
}

async function getRateLimitInfo() {
  const response = await fetch("https://api.github.com/rate_limit", {
    method: "GET",
    headers: headers
  });

  const data = await response.json();

  const limit = data.resources.core.limit;
  const remaining = data.resources.core.remaining;
  const used = data.resources.core.used;
  const resetDateData = data.resources.core.reset;

  const resetDate = new Date(resetDateData * 1000);
  const formattedDate = formatResetDate(resetDate);
  const timeDifference = getTimeDifference(resetDate);
  console.error("| Api Ratelimit Info: |");
  console.warn(`\n| -> Limit: ${limit}\n| -> Remaining: ${remaining}\n| -> Used: ${used}\n| -> Reset Time: ${formattedDate}\n| -> Remaining Time: ${timeDifference}`);

  const rateLimitInfo = document.createElement("div");
}

function getTimeDifference(resetDate) {
  const currentTime = new Date();
  const timeDifference = resetDate - currentTime;
  const hoursRemaining = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeDifference / (1000 * 60)) % 60);
  return `${hoursRemaining}h:${minutesRemaining}min`;
}

function formatResetDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

getRateLimitInfo();

getCategorys();
