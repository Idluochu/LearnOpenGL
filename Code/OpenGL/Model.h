// assimpģ�ͼ��ؿ�
#include <assimp/Importer.hpp>
#include <assimp/scene.h>
#include <assimp/postprocess.h>

#include <vector>
#include <iostream>

#include "Shader.h"
#include "Mesh.h"


#pragma once
class Model
{
public:
	Model(const char* path);
	void Draw(Shader shader);

private:
	// ģ������
	std::vector<Mesh> meshes;
	//ģ����Դ�����ļ���·��
	std::string directory;
	//�Ѽ��ص���ͼ
	std::vector<Texture> textures_loaded;
	//����ģ��
	void loadModel(std::string path);
	//����ڵ�����
	void processNode(aiNode* node, const aiScene* scene);
	//����Mesh����
	Mesh processMesh(aiMesh* mesh, const aiScene* scene);
	//���ز�����ͼ
	std::vector<Texture> loadMaterialTextures(aiMaterial* mat, aiTextureType type, std::string typeName);
	//���ļ�������ͼ
	unsigned int TextureFromFile(const char* path, const std::string& directory, bool gamma = false);
};

