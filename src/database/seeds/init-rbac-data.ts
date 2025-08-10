import { DataSource } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { Power } from '../../entities/power.entity';
import { RolePowerRel } from '../../entities/role-power-rel.entity';
import { PERMISSIONS } from '../../modules/permission/dto/permission.dto';

export async function initRBACData(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);
  const powerRepository = dataSource.getRepository(Power);
  const rolePowerRelRepository = dataSource.getRepository(RolePowerRel);

  // 初始化角色
  const roles = [
    {
      name: 'admin',
      description: 'Administrator with full access'
    },
    {
      name: 'moderator',
      description: 'Moderator with content management access'
    },
    {
      name: 'user',
      description: 'Regular user with basic access'
    }
  ];

  const savedRoles: Role[] = [];
  for (const roleData of roles) {
    let role = await roleRepository.findOne({ where: { name: roleData.name } });
    if (!role) {
      role = roleRepository.create(roleData);
      role = await roleRepository.save(role);
    }
    savedRoles.push(role);
  }

  // 初始化权限
  const powers = [
    // 问题权限
    { name: PERMISSIONS.QUESTION_ADD, description: 'Add questions' },
    { name: PERMISSIONS.QUESTION_EDIT, description: 'Edit questions' },
    { name: PERMISSIONS.QUESTION_EDIT_WITHOUT_REVIEW, description: 'Edit questions without review' },
    { name: PERMISSIONS.QUESTION_DELETE, description: 'Delete questions' },
    { name: PERMISSIONS.QUESTION_CLOSE, description: 'Close questions' },
    { name: PERMISSIONS.QUESTION_REOPEN, description: 'Reopen questions' },
    { name: PERMISSIONS.QUESTION_VOTE_UP, description: 'Vote up questions' },
    { name: PERMISSIONS.QUESTION_VOTE_DOWN, description: 'Vote down questions' },
    { name: PERMISSIONS.QUESTION_PIN, description: 'Pin questions' },
    { name: PERMISSIONS.QUESTION_UNPIN, description: 'Unpin questions' },
    { name: PERMISSIONS.QUESTION_HIDE, description: 'Hide questions' },
    { name: PERMISSIONS.QUESTION_SHOW, description: 'Show questions' },

    // 答案权限
    { name: PERMISSIONS.ANSWER_ADD, description: 'Add answers' },
    { name: PERMISSIONS.ANSWER_EDIT, description: 'Edit answers' },
    { name: PERMISSIONS.ANSWER_EDIT_WITHOUT_REVIEW, description: 'Edit answers without review' },
    { name: PERMISSIONS.ANSWER_DELETE, description: 'Delete answers' },
    { name: PERMISSIONS.ANSWER_ACCEPT, description: 'Accept answers' },
    { name: PERMISSIONS.ANSWER_VOTE_UP, description: 'Vote up answers' },
    { name: PERMISSIONS.ANSWER_VOTE_DOWN, description: 'Vote down answers' },
    { name: PERMISSIONS.ANSWER_INVITE_SOMEONE_TO_ANSWER, description: 'Invite someone to answer' },

    // 评论权限
    { name: PERMISSIONS.COMMENT_ADD, description: 'Add comments' },
    { name: PERMISSIONS.COMMENT_EDIT, description: 'Edit comments' },
    { name: PERMISSIONS.COMMENT_DELETE, description: 'Delete comments' },
    { name: PERMISSIONS.COMMENT_VOTE_UP, description: 'Vote up comments' },
    { name: PERMISSIONS.COMMENT_VOTE_DOWN, description: 'Vote down comments' },

    // 举报权限
    { name: PERMISSIONS.REPORT_ADD, description: 'Add reports' },

    // 标签权限
    { name: PERMISSIONS.TAG_ADD, description: 'Add tags' },
    { name: PERMISSIONS.TAG_EDIT, description: 'Edit tags' },
    { name: PERMISSIONS.TAG_EDIT_SLUG_NAME, description: 'Edit tag slug names' },
    { name: PERMISSIONS.TAG_EDIT_WITHOUT_REVIEW, description: 'Edit tags without review' },
    { name: PERMISSIONS.TAG_DELETE, description: 'Delete tags' },
    { name: PERMISSIONS.TAG_SYNONYM, description: 'Manage tag synonyms' },
    { name: PERMISSIONS.TAG_USE_RESERVED_TAG, description: 'Use reserved tags' },

    // 其他权限
    { name: PERMISSIONS.LINK_URL_LIMIT, description: 'Link URL limit' },
    { name: PERMISSIONS.VOTE_DETAIL, description: 'View vote details' },
    { name: PERMISSIONS.ANSWER_AUDIT, description: 'Audit answers' },
    { name: PERMISSIONS.QUESTION_AUDIT, description: 'Audit questions' },
    { name: PERMISSIONS.TAG_AUDIT, description: 'Audit tags' },

    // 管理员权限
    { name: PERMISSIONS.ADMIN_ACCESS, description: 'Admin access' }
  ];

  const savedPowers: Power[] = [];
  for (const powerData of powers) {
    let power = await powerRepository.findOne({ where: { name: powerData.name } });
    if (!power) {
      power = powerRepository.create(powerData);
      power = await powerRepository.save(power);
    }
    savedPowers.push(power);
  }

  // 初始化角色权限关系
  const adminRole = savedRoles.find(r => r.name === 'admin');
  const moderatorRole = savedRoles.find(r => r.name === 'moderator');
  const userRole = savedRoles.find(r => r.name === 'user');

  // 管理员拥有所有权限
  if (adminRole) {
    for (const power of savedPowers) {
      const existingRel = await rolePowerRelRepository.findOne({
        where: { roleId: adminRole.id, powerType: power.name }
      });
      if (!existingRel) {
        const rolePowerRel = rolePowerRelRepository.create({
          roleId: adminRole.id,
          powerType: power.name
        });
        await rolePowerRelRepository.save(rolePowerRel);
      }
    }
  }

  // 版主权限（除了管理员专用权限）
  if (moderatorRole) {
    const moderatorPowers = savedPowers.filter(p => 
      p.name !== PERMISSIONS.ADMIN_ACCESS &&
      !p.name.includes('audit') // 审核权限只给管理员
    );
    
    for (const power of moderatorPowers) {
      const existingRel = await rolePowerRelRepository.findOne({
        where: { roleId: moderatorRole.id, powerType: power.name }
      });
      if (!existingRel) {
        const rolePowerRel = rolePowerRelRepository.create({
          roleId: moderatorRole.id,
          powerType: power.name
        });
        await rolePowerRelRepository.save(rolePowerRel);
      }
    }
  }

  // 普通用户权限（基础权限）
  if (userRole) {
    const userPowers = [
      PERMISSIONS.QUESTION_ADD,
      PERMISSIONS.ANSWER_ADD,
      PERMISSIONS.COMMENT_ADD,
      PERMISSIONS.REPORT_ADD,
      PERMISSIONS.TAG_ADD
    ];
    
    for (const powerName of userPowers) {
      const existingRel = await rolePowerRelRepository.findOne({
        where: { roleId: userRole.id, powerType: powerName }
      });
      if (!existingRel) {
        const rolePowerRel = rolePowerRelRepository.create({
          roleId: userRole.id,
          powerType: powerName
        });
        await rolePowerRelRepository.save(rolePowerRel);
      }
    }
  }

  console.log('RBAC data initialization completed');
}
