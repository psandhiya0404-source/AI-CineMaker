import React, { createContext, useContext, useState, useCallback } from 'react';
import { projectApi, characterApi, sceneApi } from '../api';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all projects for dashboard / list
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await projectApi.getAll();
      setProjects(res.data.data || []);
      return res.data.data;
    } catch (err) {
      console.error('[ProjectContext] Failed to fetch projects:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch full details of an active project (project, characters, scenes)
  const selectProject = useCallback(async (projectId) => {
    try {
      setLoading(true);
      const [projRes, charRes, sceneRes] = await Promise.all([
        projectApi.getById(projectId),
        characterApi.getByProject(projectId),
        sceneApi.getByProject(projectId),
      ]);

      setCurrentProject(projRes.data.data);
      setCharacters(charRes.data.data || []);
      setScenes(sceneRes.data.data || []);
      return projRes.data.data;
    } catch (err) {
      console.error('[ProjectContext] Failed to load project details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh current project's characters and scenes
  const refreshCurrentProject = useCallback(async () => {
    if (!currentProject?._id) return;
    try {
      const [projRes, charRes, sceneRes] = await Promise.all([
        projectApi.getById(currentProject._id),
        characterApi.getByProject(currentProject._id),
        sceneApi.getByProject(currentProject._id),
      ]);
      setCurrentProject(projRes.data.data);
      setCharacters(charRes.data.data || []);
      setScenes(sceneRes.data.data || []);
    } catch (err) {
      console.error('[ProjectContext] Failed to refresh current project:', err);
    }
  }, [currentProject]);

  // Project CRUD
  const createProject = async (data) => {
    const res = await projectApi.create(data);
    const newProj = res.data.data;
    setProjects((prev) => [newProj, ...prev]);
    setCurrentProject(newProj);
    setCharacters([]);
    setScenes([]);
    return newProj;
  };

  const updateProject = async (id, data) => {
    const res = await projectApi.update(id, data);
    const updated = res.data.data;
    setProjects((prev) => prev.map((p) => (p._id === id ? updated : p)));
    if (currentProject?._id === id) {
      setCurrentProject(updated);
    }
    return updated;
  };

  const deleteProject = async (id) => {
    await projectApi.delete(id);
    setProjects((prev) => prev.filter((p) => p._id !== id));
    if (currentProject?._id === id) {
      setCurrentProject(null);
      setCharacters([]);
      setScenes([]);
    }
  };

  // Character CRUD
  const addCharacter = async (data) => {
    if (!currentProject?._id) return;
    const res = await characterApi.create(currentProject._id, data);
    const newChar = res.data.data;
    setCharacters((prev) => [...prev, newChar]);
    return newChar;
  };

  const updateCharacter = async (id, data) => {
    const res = await characterApi.update(id, data);
    const updated = res.data.data;
    setCharacters((prev) => prev.map((c) => (c._id === id ? updated : c)));
    return updated;
  };

  const deleteCharacter = async (id) => {
    await characterApi.delete(id);
    setCharacters((prev) => prev.filter((c) => c._id !== id));
  };

  // Scene CRUD
  const addScene = async (data) => {
    if (!currentProject?._id) return;
    const res = await sceneApi.create(currentProject._id, data);
    const newScene = res.data.data;
    setScenes((prev) => [...prev, newScene]);
    return newScene;
  };

  const updateScene = async (id, data) => {
    const res = await sceneApi.update(id, data);
    const updated = res.data.data;
    setScenes((prev) => prev.map((s) => (s._id === id ? updated : s)));
    return updated;
  };

  const deleteScene = async (id) => {
    await sceneApi.delete(id);
    setScenes((prev) => prev.filter((s) => s._id !== id));
  };

  const reorderScenes = async (sceneIds) => {
    if (!currentProject?._id) return;
    const res = await sceneApi.reorder(currentProject._id, sceneIds);
    setScenes(res.data.data || []);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        characters,
        scenes,
        loading,
        fetchProjects,
        selectProject,
        refreshCurrentProject,
        createProject,
        updateProject,
        deleteProject,
        addCharacter,
        updateCharacter,
        deleteCharacter,
        addScene,
        updateScene,
        deleteScene,
        reorderScenes,
        setCurrentProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
};
