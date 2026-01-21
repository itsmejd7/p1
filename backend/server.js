const express = require("express");
const cors = require("cors");  
const fs = require("fs");
const path = require("path");

const app = express();          

app.use(cors());                
app.use(express.json());        

const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

const saveProjects = (projects) => {
  const projectsFile = path.join(__dirname, "projects.json");
  fs.writeFileSync(projectsFile, JSON.stringify({ projects }, null, 2));
};


const loadProjects = () => {
  const projectsFile = path.join(__dirname, "projects.json");
  if (fs.existsSync(projectsFile)) {
    const content = JSON.parse(fs.readFileSync(projectsFile, "utf-8"));
    return content.projects;
  }

  return [
    { id: 1, name: "Project 1", description: "Tata Motors - Electric Vehicle Initiative", status: "Active" },
    { id: 2, name: "Project 2", description: "Supply Chain Optimization", status: "Active" },
    { id: 3, name: "Project 3", description: "Quality Assurance System", status: "Active" },
    { id: 4, name: "Project 4", description: "Digital Transformation", status: "In Progress" },
    { id: 5, name: "Project 5", description: "Manufacturing Excellence", status: "Active" },
    { id: 6, name: "Project 6", description: "Customer Analytics Platform", status: "Planning" },
    { id: 7, name: "Project 7", description: "Autonomous Vehicle Research", status: "Active" }
  ];
};

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = data.users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({ success: true, role: user.role });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.get("/api/projects", (req, res) => {
  const projects = loadProjects();
  res.json(projects);
});

// Slug-based route MUST come before :id route to match correctly
app.get("/api/projects/slug/:slug", (req, res) => {
  const projects = loadProjects();
  const project = projects.find(p => p.slug === req.params.slug);
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
});

// Generic ID-based route comes after slug route
app.get("/api/projects/:id", (req, res) => {
  const projects = loadProjects();
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
});

app.post("/api/projects", (req, res) => {
  const projects = loadProjects();
  const { name, description, status } = req.body;
  
  if (!name || !description || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newProject = {
    id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
    name,
    description,
    status
  };

  projects.push(newProject);
  saveProjects(projects);
  res.status(201).json(newProject);
});

app.put("/api/projects/:id", (req, res) => {
  const projects = loadProjects();
  const { name, description, status } = req.body;
  const projectIndex = projects.findIndex(p => p.id === parseInt(req.params.id));

  if (projectIndex === -1) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (!name || !description || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  projects[projectIndex] = {
    ...projects[projectIndex],
    name,
    description,
    status
  };

  saveProjects(projects);
  res.json(projects[projectIndex]);
});

app.delete("/api/projects/:id", (req, res) => {
  const projects = loadProjects();
  const projectIndex = projects.findIndex(p => p.id === parseInt(req.params.id));

  if (projectIndex === -1) {
    return res.status(404).json({ message: "Project not found" });
  }

  projects.splice(projectIndex, 1);
  saveProjects(projects);
  res.json({ message: "Project deleted successfully" });
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});