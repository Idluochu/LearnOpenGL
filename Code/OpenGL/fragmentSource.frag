#version 330 core
struct Material
{
	sampler2D diffuse;	//��������ͼ
    sampler2D specular; //�߹���ͼ
	float shininess;	//�߹ⷶΧ
};


struct DirLight
{
	vec3 color;
	vec3 direction;		//���շ���
	
	vec3 ambient;		//������
	vec3 diffuse;		//������
	vec3 specular;		//�߹ⷴ��
};

struct PointLight
{
	vec3 color;
	vec3 position;		//��Դλ��
	float constant;		//˥������
	float linear;		//˥��һ�γ���
	float quadratic;	//˥�����γ���

	vec3 ambient;		//������
	vec3 diffuse;		//������
	vec3 specular;		//�߹ⷴ��
};

struct SpotLight
{
	vec3 color;
	vec3 position;		//��Դλ��
	vec3 direction;		//���շ���
	float cutOff;		//���й�Ƕ�
	float outerCutOff;	//���й�Ƕ�

	vec3 ambient;		//������
	vec3 diffuse;		//������
	vec3 specular;		//�߹ⷴ��
};

#define NR_POINT_LIGHTS 1

uniform Material material;
uniform DirLight dirLight;
uniform PointLight pointLights[NR_POINT_LIGHTS];;
uniform SpotLight spotLight;

out vec4 FragColor;
in vec4 vertexColor;
in vec2 TexCoords;
in vec3 Normal;
in vec3 WorldPos;

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec3 lightColor;
uniform vec3 objectColor;
uniform vec3 viewPos;

vec3 CalcDirLight(DirLight light,vec3 normal, vec3 viewDir);
vec3 CalcPointLight(PointLight light,vec3 normal, vec3 viewDir);
vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 viewDir);

void main()
{
	vec3 worldNormal = normalize(Normal);
	vec3 viewDir = normalize(viewPos - WorldPos);
	vec3 result = CalcDirLight(dirLight, worldNormal, viewDir);
	for(int i = 0; i < NR_POINT_LIGHTS; i++)
	{
		result += CalcPointLight(pointLights[i], worldNormal, viewDir);
	}
	result += CalcSpotLight(spotLight, worldNormal, viewDir);

	FragColor = vec4(result, 1.0);
}

//����ƽ�й�
vec3 CalcDirLight(DirLight light,vec3 normal, vec3 viewDir)
{
	vec4 diffuseTex = texture(material.diffuse, TexCoords);
	vec4 specularTex = texture(material.specular, TexCoords);

	vec3 lightDir = normalize(-light.direction); //���ռ�������һ����Ƭ������Դ�Ĺ��߷���,����ȡ��
	vec3 reflectDir = reflect(-lightDir, normal);
	
	//������
	vec3 ambient = light.ambient * vec3(diffuseTex) * light.color;

	//������
	float diff = max(dot(normal, lightDir), 0.0);
	vec3 diffuse = light.diffuse * diff * vec3(diffuseTex)* light.color;

	//�߹ⷴ��
	float specularShininess = 32;
	float spec = pow(max(dot(viewDir,reflectDir),0.0),specularShininess);
	vec3 specular = light.specular * spec * vec3(specularTex)* light.color;

	return ambient + diffuse + specular;
}

//������
vec3 CalcPointLight(PointLight light,vec3 normal, vec3 viewDir)
{
	float distance = length(light.position - WorldPos);
	//˥��ֵ
	float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));

	vec4 diffuseTex = texture(material.diffuse, TexCoords);
	vec4 specularTex = texture(material.specular, TexCoords);
	vec3 lightDir = normalize(light.position - WorldPos);
	vec3 reflectDir = reflect(-lightDir, normal);
	
	//������
	vec3 ambient = light.ambient * vec3(diffuseTex)* light.color;

	//������
	float diff = max(dot(normal, lightDir), 0.0);
	vec3 diffuse = light.diffuse * diff * vec3(diffuseTex)* light.color;

	//�߹ⷴ��
	float specularShininess = 32;
	float spec = pow(max(dot(viewDir,reflectDir),0.0),specularShininess);
	vec3 specular = light.specular * spec * vec3(specularTex)* light.color;

	//���Դ˥��ֵ
	ambient  *= attenuation; 
	diffuse  *= attenuation;
	specular *= attenuation;

	return ambient + diffuse + specular; 
}

//����۹�
vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 viewDir)
{
	vec4 diffuseTex = texture(material.diffuse, TexCoords);
	vec4 specularTex = texture(material.specular, TexCoords);
	vec3 lightDir = normalize(light.position - WorldPos);
	vec3 reflectDir = reflect(-lightDir, normal);

	float theta = dot(lightDir, normalize(-light.direction));
	float epsilon = light.cutOff - light.outerCutOff;
	//�۹�ǿ��
	float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0); 
	
	//������
	vec3 ambient = light.ambient * vec3(diffuseTex)* light.color;

	//������
	float diff = max(dot(normal, lightDir), 0.0);
	vec3 diffuse = light.diffuse * diff * vec3(diffuseTex)* light.color;

	//�߹ⷴ��
	float specularShininess = 32;
	float spec = pow(max(dot(viewDir,reflectDir),0.0),specularShininess);
	vec3 specular = light.specular * spec * vec3(specularTex) * light.color;

	//�۹������Ե
	diffuse  *= intensity;
	specular *= intensity;
	ambient *= intensity;

	return ambient + diffuse + specular; 
}