#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <string>
#include <vector>
#include "Shader.h"

struct Vertex
{
	glm::vec3 Position;		//��������
	glm::vec3 Normal;		//���߷���
	glm::vec3 Tangent;		//���߷���
	glm::vec3 Bitangent;	//�����߷���
	glm::vec2 TexCoords;	//��������
};

struct Texture
{
	unsigned int id;	//��ͼId
	std::string type;	//��ͼ���ͣ���������ͼ�����Ǿ������ͼ��
	std::string path;	//��ͼ·��
};

#pragma once
class Mesh
{
public:
	#pragma region ��������
	//��������
	std::vector<Vertex> vertices;
	//������������
	std::vector<unsigned int> indices;
	//��ͼ����
	std::vector<Texture> textures;
	#pragma endregion
	//����
	Mesh(std::vector<Vertex> vertices, std::vector<unsigned int> indices, std::vector<Texture> textures);
	//DrawCall
	void Draw(Shader shader);
private:
	#pragma region ��Ⱦ����
	unsigned int VAO;
	unsigned int VBO;
	unsigned int EBO;
	#pragma endregion
	//����Mesh
	void setupMesh();
};

