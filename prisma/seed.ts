import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // ---------------------------------------------------------------
  // Clean slate in reverse-dependency order (idempotent re-run).
  // ---------------------------------------------------------------
  await prisma.manualStep.deleteMany();
  await prisma.projectManual.deleteMany();
  await prisma.projectTechStack.deleteMany();
  await prisma.project.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.techCategory.deleteMany();
  await prisma.user.deleteMany();

  // ---------------------------------------------------------------
  // Admin user
  // Password comes from ADMIN_PASSWORD env var (required for tests
  // where we need to know the password). Falls back to a random
  // string for ad-hoc prod bootstrap.
  // ---------------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
  const adminName = process.env.ADMIN_NAME || 'Admin';
  const adminPassword =
    process.env.ADMIN_PASSWORD || crypto.randomBytes(16).toString('hex');
  const hashedPassword = bcrypt.hashSync(adminPassword, 10);

  await prisma.user.create({
    data: {
      id: 'cmihnqkyv0000onj90no72d70',
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
    },
  });

  // ---------------------------------------------------------------
  // TechCategories
  // ---------------------------------------------------------------
  await prisma.techCategory.createMany({
    data: [
      { id: 'cmj73c6za0000onqbh8f4rlzp', name: 'back-end' },
      { id: 'cmj73ccnf0001onqb3erne9rh', name: 'front-end' },
      { id: 'cmj73fx360002onqbvcekw39z', name: 'full-stack' },
    ],
  });

  // ---------------------------------------------------------------
  // Technologies
  // ---------------------------------------------------------------
  await prisma.technology.createMany({
    data: [
      { id: 'cmj74obpd0008onqbv3mlyiel', name: 'HTML', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/HTML5_Badge.svg/2048px-HTML5_Badge.svg.png', official_site_url: 'https://html.com/html5/', categoryId: 'cmj73ccnf0001onqb3erne9rh', sort_order: 1 },
      { id: 'cmj73ib6o0003onqbdlzip7ez', name: 'React', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg', official_site_url: 'https://react.dev/', categoryId: 'cmj73ccnf0001onqb3erne9rh', sort_order: 2 },
      { id: 'cmj74svqr0009onqb9v9sgkhu', name: 'CSS', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/CSS3_logo.svg/2048px-CSS3_logo.svg.png', official_site_url: 'https://www.w3.org/Style/CSS/Overview.en.html', categoryId: 'cmj73ccnf0001onqb3erne9rh', sort_order: 3 },
      { id: 'cmka6jbto000rlw0w009g35ya', name: 'Bootstrap', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Bootstrap_logo.svg/1280px-Bootstrap_logo.svg.png?20210507000024', official_site_url: 'https://getbootstrap.com/', categoryId: 'cmj73ccnf0001onqb3erne9rh', sort_order: 4 },
      { id: 'cmka6n9k3000tlw0w5oqsag79', name: 'Tailwind CSS', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1280px-Tailwind_CSS_Logo.svg.png?20230715030042', official_site_url: 'https://tailwindcss.com/', categoryId: 'cmj73ccnf0001onqb3erne9rh', sort_order: 5 },
      { id: 'cmmdjpyi00005g30izqev0p2c', name: 'SCSS / Sass', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Sass_Logo_Color.svg/1280px-Sass_Logo_Color.svg.png?_=20150315202757', official_site_url: 'https://sass-lang.com/', categoryId: 'cmj73ccnf0001onqb3erne9rh', sort_order: 6 },
      { id: 'cmj750tqn000aonqb3eh3p3od', name: 'JavaScript', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png', official_site_url: 'https://www.javascript.com/', categoryId: 'cmj73fx360002onqbvcekw39z', sort_order: 7 },
      { id: 'cmka6vlbm0013lw0w86dl8kvn', name: 'TypeScript', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1280px-Typescript_logo_2020.svg.png?20221110153201', official_site_url: 'https://www.typescriptlang.org/', categoryId: 'cmj73fx360002onqbvcekw39z', sort_order: 8 },
      { id: 'cmj8x9o35000alwuwhc48o87c', name: 'Node.js', logo_url: 'https://www.svgrepo.com/show/303360/nodejs-logo.svg', official_site_url: 'https://nodejs.org/en', categoryId: 'cmj73c6za0000onqbh8f4rlzp', sort_order: 9 },
      { id: 'cmka6rqs0000vlw0whm95jtrn', name: 'Express.js', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png?20170429090805', official_site_url: 'https://expressjs.com/', categoryId: 'cmj73c6za0000onqbh8f4rlzp', sort_order: 10 },
      { id: 'cmmdjkkjz0001g30it19ludg5', name: 'Java', logo_url: 'https://upload.wikimedia.org/wikipedia/fr/2/2e/Java_Logo.svg', official_site_url: 'https://www.java.com/en/', categoryId: 'cmj73c6za0000onqbh8f4rlzp', sort_order: 11 },
      { id: 'cmmdjmzdb0003g30iurrt121k', name: 'Spring Boot', logo_url: 'https://spring.io/img/spring-2.svg', official_site_url: 'https://spring.io/', categoryId: 'cmj73c6za0000onqbh8f4rlzp', sort_order: 12 },
      { id: 'cmk5ptnql001plw6ero69prri', name: 'JSON', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/JSON_vector_logo.svg', official_site_url: 'https://www.json.org/json-en.html', categoryId: 'cmj73c6za0000onqbh8f4rlzp', sort_order: 13 },
      { id: 'cmk5pr9i4001nlw6ebmmv5rqu', name: 'Gemini API', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg', official_site_url: 'https://ai.google.dev/', categoryId: 'cmj73c6za0000onqbh8f4rlzp', sort_order: 14 },
      { id: 'cmj8xc5ns000jlwuwqd6d0kxy', name: 'MongoDB', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Mongodb.png', official_site_url: 'https://www.mongodb.com/', categoryId: 'cmj73c6za0000onqbh8f4rlzp', sort_order: 15 },
      { id: 'cmka6xf4p0015lw0wt3z72zfe', name: 'PostgreSQL', logo_url: 'https://www.postgresql.org/media/img/about/press/elephant.png', official_site_url: 'https://www.postgresql.org/', categoryId: 'cmj73c6za0000onqbh8f4rlzp', sort_order: 16 },
      { id: 'cmkn36gi80001cn0i0bhrkruy', name: 'Docker', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Docker_Logo.svg/1280px-Docker_Logo.svg.png?20250930100937', official_site_url: 'https://www.docker.com/', categoryId: 'cmj73fx360002onqbvcekw39z', sort_order: 17 },
    ],
  });

  // ---------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------
  await prisma.project.createMany({
    data: [
      { id: 'cmj73k9be0004onqb2o9i3l9m', name: 'Work-Life Balance', server_github_url: '', client_github_url: 'https://github.com/VeraV/work-life-balance-game-project', server_deploy_url: '', client_deploy_url: 'https://verav.github.io/work-life-balance-game-project/', description_short: 'This is a browser-based game built with HTML, CSS, JavaScript, DOM manipulation, and Object-Oriented Programming (OOP). It’s my first project at Ironhack (Module 1).  The goal? Balance between work and life before things get out of control!', image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768162670/portfolio/vpb1r8gpiqgnsghs5dtq.png', sort_order: 1 },
      { id: 'cmj74ad860005onqbehbjajpt', name: 'Echo Diary', server_github_url: 'https://github.com/VeraV/json-server-backend', client_github_url: 'https://github.com/VeraV/write_your_own_story', server_deploy_url: 'https://json-server-backend-kklv.onrender.com/', client_deploy_url: 'https://write-your-own-story.vercel.app/', description_short: 'Echo Diary is a mindful journaling app that blends human emotion and artificial intelligence. You write your thoughts and feelings for the day — and Echo gently responds with empathy, reflection, and supportive insights.  ✨ “You write to Echo, and Echo listens.”', image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768162658/portfolio/pzs9op0kuufakggiseuc.png', sort_order: 2 },
      { id: 'cmj74fpnc0006onqbm89x7xax', name: 'Plantastic', server_github_url: 'https://github.com/VeraV/plantastic-server', client_github_url: 'https://github.com/VeraV/plantastic-client', server_deploy_url: '', client_deploy_url: 'https://plantastic-gold.vercel.app/', description_short: 'Plan. Shop. Eat. Repeat. Plantastic is a full-stack web application designed to make vegetarian meal planning simple, enjoyable, and efficient. Users can explore a variety of vegetarian recipes, create meal plans, manage ingredients, and export shopping lists directly to their phones.  The main goal is to provide a light, intuitive, and visually appealing user experience for everyday cooking and shopping.', image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768162643/portfolio/lwwwzn2cgiug83coet2z.png', sort_order: 3 },
      { id: 'cmj74iiet0007onqbnsqskgki', name: 'Portfolio', server_github_url: 'https://github.com/VeraV/portfolio-server', client_github_url: 'https://github.com/VeraV/portfolio-client', server_deploy_url: '', client_deploy_url: 'https://veramei.dev/', description_short: 'Full-stack portfolio website with admin dashboard. Features project management, tech stack visualization, and step-by-step manuals. Built with React, Express, TypeScript, Prisma ORM, and PostgreSQL with JWT authentication.', image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768162623/portfolio/yxzbp8kigenbchhoyuzx.png', sort_order: 4 },
      { id: 'cmmdjq4s20006g30i98sk8a0w', name: 'Yoga Path', server_github_url: 'https://github.com/VeraV/yoga-path-server', client_github_url: 'https://github.com/VeraV/yoga-path-client', server_deploy_url: '', client_deploy_url: 'https://yoga-path.veramei.dev/', description_short: 'Full-stack yoga recommendation platform with authentication and practice tracking. Features personalized yoga routine generation based on user preferences, balanced practice planning (asana, pranayama, meditation, mantra), and session logging to monitor progress. Built with Spring Boot, REST API architecture, Hibernate ORM, PostgreSQL, and JWT authentication, with a React + TypeScript frontend, and Docker for containerized development.', image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1772719352/portfolio/ffjs8hrla4femqwuni3g.png', sort_order: null },
    ],
  });

  // ---------------------------------------------------------------
  // ProjectTechStack (join table)
  // ---------------------------------------------------------------
  await prisma.projectTechStack.createMany({
    data: [
      // Echo Diary
      { id: 'cmkcj0dfm001dlw0w9j6dq1za', projectId: 'cmj74ad860005onqbehbjajpt', technologyId: 'cmj73ib6o0003onqbdlzip7ez' },
      { id: 'cmkcj0dfm001elw0wn6de8v32', projectId: 'cmj74ad860005onqbehbjajpt', technologyId: 'cmj74svqr0009onqb9v9sgkhu' },
      { id: 'cmkcj0dfm001flw0w8rjtgkbv', projectId: 'cmj74ad860005onqbehbjajpt', technologyId: 'cmj750tqn000aonqb3eh3p3od' },
      { id: 'cmkcj0dfm001glw0wywiwznn2', projectId: 'cmj74ad860005onqbehbjajpt', technologyId: 'cmj8x9o35000alwuwhc48o87c' },
      { id: 'cmkcj0dfm001hlw0w9wweia97', projectId: 'cmj74ad860005onqbehbjajpt', technologyId: 'cmk5pr9i4001nlw6ebmmv5rqu' },
      { id: 'cmkcj0dfm001ilw0wqeq8rp6h', projectId: 'cmj74ad860005onqbehbjajpt', technologyId: 'cmk5ptnql001plw6ero69prri' },
      // Plantastic
      { id: 'cmkcjzvy2001qlw0wfgnli8jj', projectId: 'cmj74fpnc0006onqbm89x7xax', technologyId: 'cmj73ib6o0003onqbdlzip7ez' },
      { id: 'cmkcjzvy2001rlw0w04ku28r8', projectId: 'cmj74fpnc0006onqbm89x7xax', technologyId: 'cmka6jbto000rlw0w009g35ya' },
      { id: 'cmkcjzvy2001slw0w63xwatb1', projectId: 'cmj74fpnc0006onqbm89x7xax', technologyId: 'cmj8x9o35000alwuwhc48o87c' },
      { id: 'cmkcjzvy2001tlw0wklr5lazq', projectId: 'cmj74fpnc0006onqbm89x7xax', technologyId: 'cmka6rqs0000vlw0whm95jtrn' },
      { id: 'cmkcjzvy2001ulw0wdvwa0zz9', projectId: 'cmj74fpnc0006onqbm89x7xax', technologyId: 'cmj8xc5ns000jlwuwqd6d0kxy' },
      // Work-Life Balance
      { id: 'cmka6ei8o000nlw0w9ucawfmo', projectId: 'cmj73k9be0004onqb2o9i3l9m', technologyId: 'cmj74obpd0008onqbv3mlyiel' },
      { id: 'cmka6ei8o000olw0wlljg9saf', projectId: 'cmj73k9be0004onqb2o9i3l9m', technologyId: 'cmj74svqr0009onqb9v9sgkhu' },
      { id: 'cmka6ei8o000plw0w6wfzdxxw', projectId: 'cmj73k9be0004onqb2o9i3l9m', technologyId: 'cmj750tqn000aonqb3eh3p3od' },
      // Portfolio
      { id: 'cmkv3gey20001bw0ifu0m08ry', projectId: 'cmj74iiet0007onqbnsqskgki', technologyId: 'cmj73ib6o0003onqbdlzip7ez' },
      { id: 'cmkv3gey20002bw0izrz1ardj', projectId: 'cmj74iiet0007onqbnsqskgki', technologyId: 'cmj8x9o35000alwuwhc48o87c' },
      { id: 'cmkv3gey20003bw0ihs6eoqii', projectId: 'cmj74iiet0007onqbnsqskgki', technologyId: 'cmka6n9k3000tlw0w5oqsag79' },
      { id: 'cmkv3gey20004bw0ikclvkfes', projectId: 'cmj74iiet0007onqbnsqskgki', technologyId: 'cmka6vlbm0013lw0w86dl8kvn' },
      { id: 'cmkv3gey20005bw0iu89eog0y', projectId: 'cmj74iiet0007onqbnsqskgki', technologyId: 'cmka6xf4p0015lw0wt3z72zfe' },
      { id: 'cmkv3gey20006bw0iqgboq1fc', projectId: 'cmj74iiet0007onqbnsqskgki', technologyId: 'cmkn36gi80001cn0i0bhrkruy' },
      // Yoga Path
      { id: 'cmmdki5f2000gg30iefuikspm', projectId: 'cmmdjq4s20006g30i98sk8a0w', technologyId: 'cmj73ib6o0003onqbdlzip7ez' },
      { id: 'cmmdki5f2000hg30i0rslvil9', projectId: 'cmmdjq4s20006g30i98sk8a0w', technologyId: 'cmmdjpyi00005g30izqev0p2c' },
      { id: 'cmmdki5f2000ig30iiznjifvt', projectId: 'cmmdjq4s20006g30i98sk8a0w', technologyId: 'cmka6vlbm0013lw0w86dl8kvn' },
      { id: 'cmmdki5f2000jg30ihlybdjc9', projectId: 'cmmdjq4s20006g30i98sk8a0w', technologyId: 'cmmdjkkjz0001g30it19ludg5' },
      { id: 'cmmdki5f2000kg30ijw2ksbu6', projectId: 'cmmdjq4s20006g30i98sk8a0w', technologyId: 'cmmdjmzdb0003g30iurrt121k' },
      { id: 'cmmdki5f2000lg30iur6wii0x', projectId: 'cmmdjq4s20006g30i98sk8a0w', technologyId: 'cmka6xf4p0015lw0wt3z72zfe' },
      { id: 'cmmdki5f2000mg30iy73uwl2z', projectId: 'cmmdjq4s20006g30i98sk8a0w', technologyId: 'cmkn36gi80001cn0i0bhrkruy' },
    ],
  });

  // ---------------------------------------------------------------
  // ProjectManuals
  // ---------------------------------------------------------------
  await prisma.projectManual.createMany({
    data: [
      { id: 'cmjt0q1ao0019lw0oykanqwjw', projectId: 'cmj74ad860005onqbehbjajpt', title: 'Main', description: 'Main manual with all the features', version: '1.0', isActive: true },
      { id: 'cmjsglzwo000dlw0ozikh668v', projectId: 'cmj73k9be0004onqb2o9i3l9m', title: 'Basics', description: 'Basic operations', version: '1.0', isActive: true },
      { id: 'cmke83j2l001wlw0wjh3sk28k', projectId: 'cmj74fpnc0006onqbm89x7xax', title: 'Main Features', description: 'Only main cool features', version: '1.0', isActive: false },
      { id: 'cmk1dqqe70001lw6e46h7ffuf', projectId: 'cmj74fpnc0006onqbm89x7xax', title: 'Main', description: 'Short descriptions, combined images.', version: '1.0', isActive: true },
      { id: 'cmkeao7u60020lw0wnez1kggn', projectId: 'cmj74iiet0007onqbnsqskgki', title: 'All features', description: 'With functionality for Admin user.', version: '1.0', isActive: true },
      { id: 'cmmdkiy5k000og30im165lf1y', projectId: 'cmmdjq4s20006g30i98sk8a0w', title: 'main', description: 'every step', version: '1.0', isActive: true },
    ],
  });

  // ---------------------------------------------------------------
  // ManualSteps
  // ---------------------------------------------------------------
  await prisma.manualStep.createMany({
    data: [
      // Work-Life Balance - Basics
      { id: 'cmjt072zl000ylw0oww5w429b', manualId: 'cmjsglzwo000dlw0ozikh668v', step_number: 1, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767890030/portfolio/nymkrut5scbss7yb1sw9.png', description: 'Home Page. Explains the game rules and shows flying objects the player must catch or avoid.' },
      { id: 'cmjt07dyk0010lw0o1pciiklx', manualId: 'cmjsglzwo000dlw0ozikh668v', step_number: 2, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767890223/portfolio/nzfyqbrfzqlmvjtpktwt.png', description: 'Game Page. Contains two main areas: the playing field (1), where the game happens, and the stats panel (2).' },
      { id: 'cmjt08p070012lw0ojmvshp9z', manualId: 'cmjsglzwo000dlw0ozikh668v', step_number: 3, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767890247/portfolio/spkheclmildxshynt8on.png', description: 'Gameplay. The player (1) moves up, down, left, and right using the keyboard. Flying objects (2) move from right to left. ' },
      { id: 'cmk5oimqx001jlw6e1bld6khp', manualId: 'cmjsglzwo000dlw0ozikh668v', step_number: 4, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767890764/portfolio/jddpz30fx6lt9omtu06n.png', description: 'Objects. There are 7 object types that affect energy, money, resilience, and time in different ways. Challenging objects reduce energy but increase resilience.' },
      { id: 'cmk5olbsq001llw6eb4xjjj2s', manualId: 'cmjsglzwo000dlw0ozikh668v', step_number: 5, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767890890/portfolio/b6erzdyta9xd9ywsflvv.png', description: 'Game Over. The game ends when energy (1), money or time (2) reaches zero.' },
      // Echo Diary - Main
      { id: 'cmjt1o4v8001blw0on3gxkxcg', manualId: 'cmjt0q1ao0019lw0oykanqwjw', step_number: 1, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767881006/portfolio/y9t4rgkvx9nx4fzdb0o6.png', description: 'Home Page. A short introduction to the website with a login option.' },
      { id: 'cmjt1ofi0001dlw0orrjwabbi', manualId: 'cmjt0q1ao0019lw0oykanqwjw', step_number: 2, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767881166/portfolio/zfufj7g0zl3pdyejz8rm.png', description: 'About Us. General information about the project. Available without logging in.' },
      { id: 'cmk5iwatk000vlw6ejze3d51e', manualId: 'cmjt0q1ao0019lw0oykanqwjw', step_number: 3, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767881324/portfolio/aovsp0rzhtrnpivmgizg.png', description: 'Log In. Log in using your name and email. The system matches your data with the backend.' },
      { id: 'cmk5iyp8x000xlw6ex0fzjy1v', manualId: 'cmjt0q1ao0019lw0oykanqwjw', step_number: 4, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767881422/portfolio/qhe0dor0tmrvnneu16cw.png', description: 'Sign Up. Create a mock account by entering a name, email, and choosing whether you are an admin.' },
      { id: 'cmk5j4hse000zlw6e89qnhonz', manualId: 'cmjt0q1ao0019lw0oykanqwjw', step_number: 5, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767881707/portfolio/x305ypzyakzevrlrzkou.png', description: 'User Dashboard (not admin). After logging in, users are redirected to their dashboard. From here they can view, create, edit, or delete daily notes.' },
      { id: 'cmk5jb7ju0011lw6ey94184t0', manualId: 'cmjt0q1ao0019lw0oykanqwjw', step_number: 6, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767882015/portfolio/puofwj9zxx4jfodlvvsm.png', description: 'Create Day Notes. Click Journal Today to answer 8 reflection questions, shown one at a time.' },
      { id: 'cmk5mmd460013lw6ecty5w9jc', manualId: 'cmjt0q1ao0019lw0oykanqwjw', step_number: 7, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767887510/portfolio/qwusui2nrdsqqfocitwa.png', description: 'Generate Diary Response. After the final question, users can generate a diary response using an external AI service.' },
      { id: 'cmk5mo7ir0015lw6eyol5vb5x', manualId: 'cmjt0q1ao0019lw0oykanqwjw', step_number: 8, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767887595/portfolio/xu853tfyaiadv6q2cyyo.png', description: 'Response Loading. A glowing Buddha spinner indicates the response is being generated.' },
      { id: 'cmk5mq8o70017lw6ec1bjrhjm', manualId: 'cmjt0q1ao0019lw0oykanqwjw', step_number: 9, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767887676/portfolio/qbed6bocjgztcxvd508i.png', description: 'Save or Exit. Users can save the day’s notes or return to the dashboard without saving.' },
      { id: 'cmk5ms2yg0019lw6efnikvwwa', manualId: 'cmjt0q1ao0019lw0oykanqwjw', step_number: 10, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767887796/portfolio/g7fb9ppprryi4fuyivxa.png', description: 'View Notes. Day notes can be accessed from the user dashboard.' },
      { id: 'cmk5msrlw001blw6eebtxvbyl', manualId: 'cmjt0q1ao0019lw0oykanqwjw', step_number: 11, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767887867/portfolio/bpaeatwd95fgfwxhz9hq.png', description: 'Edit Notes. Users can edit their saved daily reflections.' },
      { id: 'cmk5mvavm001dlw6ecf6u7t7z', manualId: 'cmjt0q1ao0019lw0oykanqwjw', step_number: 12, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767887893/portfolio/yax9mxrulkuesmbw4f09.png', description: 'Admin Dashboard. Admin users manage other users and can delete accounts. They do not create diary notes.' },
      // Plantastic - Main
      { id: 'cmk1dtwwr0003lw6e5uk5hai7', manualId: 'cmk1dqqe70001lw6e46h7ffuf', step_number: 1, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767630947/portfolio/t85otul2hfnehmbqj6qb.png', description: 'Home Page. A short introduction to the website and the solutions it provides.' },
      { id: 'cmk1e08670005lw6elw40jh96', manualId: 'cmk1dqqe70001lw6e46h7ffuf', step_number: 2, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767631243/portfolio/cakytexxmo5yewxtxbn0.png', description: 'All Recipes. Browse all existing recipes without logging in.' },
      { id: 'cmk1e92ow0007lw6e7y2t20zc', manualId: 'cmk1dqqe70001lw6e46h7ffuf', step_number: 3, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767631656/portfolio/oujnvna7eayevzj8hbbt.png', description: 'Recipe Page. View recipe details. Logged-in users can edit or delete recipes; visitors can read only.' },
      { id: 'cmk1eblsf0009lw6eyhzazukj', manualId: 'cmk1dqqe70001lw6e46h7ffuf', step_number: 4, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767631776/portfolio/a8juxt2arna65cv3pc1a.png', description: 'About Me Page. Learn more about the project and the author. Available to everyone.' },
      { id: 'cmk1edhdw000blw6e7rs1vz7g', manualId: 'cmk1dqqe70001lw6e46h7ffuf', step_number: 5, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767633454/portfolio/yczr8xoigud9wp88qvjn.png', description: 'Log in to access additional features.' },
      { id: 'cmk49dekz000dlw6eiw63s9hx', manualId: 'cmk1dqqe70001lw6e46h7ffuf', step_number: 6, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767804860/portfolio/u2qqqgb9mvpuku8gl65h.png', description: 'Sign Up. Create an account using any valid email and a password. Emails are stored securely and never used.' },
      { id: 'cmk4a3zap000flw6e6vynklb9', manualId: 'cmk1dqqe70001lw6e46h7ffuf', step_number: 7, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767806100/portfolio/p4kdglrkayqvgjphxt6d.png', description: 'Dashboard. Available to logged-in users. From here you can:\n1. Manage recipes (create, update, delete)\n2. Create or update meal plans\n3. Manage the shopping list\nExamples show dashboards for new and existing users.' },
      { id: 'cmk4a6n24000hlw6e8ensxjxv', manualId: 'cmk1dqqe70001lw6e46h7ffuf', step_number: 8, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767806799/portfolio/quhfkhohsvgtrln1itau.png', description: 'New Recipe. Create a new recipe with ingredients and details.' },
      { id: 'cmk4avfrr000jlw6eyttkkx38', manualId: 'cmk1dqqe70001lw6e46h7ffuf', step_number: 9, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767807381/portfolio/nbdhcf4qrysgxwfy82rq.png', description: 'Meal Plan. Create a meal plan by selecting recipies. Click Add to Plan (1) to include a recipe. Ingredients (2) are added automatically and amounts are updated if needed.' },
      { id: 'cmk4b3wea000llw6et7loka86', manualId: 'cmk1dqqe70001lw6e46h7ffuf', step_number: 10, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767807776/portfolio/egogv4ssfpopomb3pecg.png', description: 'Shopping List. Add ingredients to the shopping list using the shop icon. Items can be removed anytime.' },
      { id: 'cmk4b8g2m000nlw6e5fk0bom2', manualId: 'cmk1dqqe70001lw6e46h7ffuf', step_number: 11, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767807988/portfolio/d41n6neorx9pd9nsv7lw.png', description: 'Dashboard Auto Updates. Saving a meal plan automatically updates the shopping list on the dashboard.' },
      { id: 'cmk4bddt8000plw6ew9cd520t', manualId: 'cmk1dqqe70001lw6e46h7ffuf', step_number: 12, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767808219/portfolio/pl6usbx93iahxym47fyk.png', description: 'Edit Items. Edit or remove individual shopping list items.' },
      { id: 'cmk4bftqs000rlw6edjtxe44a', manualId: 'cmk1dqqe70001lw6e46h7ffuf', step_number: 13, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767808333/portfolio/e2rhv5ggq8r1y7dexcjt.png', description: 'Save or Clear. Save the shopping list between sessions or clear it completely. Unsaved changes are lost on refresh.' },
      { id: 'cmk4bue2j000tlw6eligkfg7b', manualId: 'cmk1dqqe70001lw6e46h7ffuf', step_number: 14, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1767809144/portfolio/gs2cwiqwsezkrkasnnmo.png', description: 'Export the shopping list to apps like Notes and turn it into a checklist for easy shopping.' },
      // Plantastic - Main Features
      { id: 'cmke84iao001ylw0w98wfvjdc', manualId: 'cmke83j2l001wlw0wjh3sk28k', step_number: 1, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768407426/portfolio/hhshn7efuybtayqhwnki.png', description: 'sdgsdg' },
      // Portfolio - All features
      { id: 'cmkeapqyj0022lw0wj7mc11uw', manualId: 'cmkeao7u60020lw0wnez1kggn', step_number: 1, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768411757/portfolio/fy5kkwpoepnzwjqqfkax.png', description: 'Home Page. Shows a short introduction and a list of projects I’ve built. Available to all visitors.' },
      { id: 'cmkearzhs0024lw0wsmvf1n1k', manualId: 'cmkeao7u60020lw0wnez1kggn', step_number: 2, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768411882/portfolio/xkbxisuwjrlhdzhxnnso.png', description: 'About Me. More details about me and my background.' },
      { id: 'cmkeax4jw0026lw0wa7oresks', manualId: 'cmkeao7u60020lw0wnez1kggn', step_number: 3, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768412122/portfolio/xa5kjq7f7dhksmfgypzz.png', description: 'Project Page. You’re on this page right now 🙂 It shows the user manual, so visitors can explore all features without opening the app or signing in.' },
      { id: 'cmkeayq800028lw0wzj4alp6t', manualId: 'cmkeao7u60020lw0wnez1kggn', step_number: 4, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768412196/portfolio/rgwdrafdfiebo7udgril.png', description: 'Admin Access. This is a single-admin portfolio app. Only login (no sign-up) is available and used by me, the site owner.' },
      { id: 'cmkeb1fo3002alw0wh66lo46p', manualId: 'cmkeao7u60020lw0wnez1kggn', step_number: 5, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768412323/portfolio/fmjm4d9ihn5go2t62ojd.png', description: 'Admin Features. When logged in as admin, additional actions are available: create/update/delete projects (see on image), create/update/delete user manuals and create/update manual steps (see below).' },
      { id: 'cmkeb22eh002clw0wcs1k1ywb', manualId: 'cmkeao7u60020lw0wnez1kggn', step_number: 6, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768412352/portfolio/nf3w3a1f0ec9ddrcqavg.png', description: 'New Project. Add project details such as links, images (via Cloudinary), and used technologies.' },
      { id: 'cmkeb2zfv002elw0w1h4uvkeq', manualId: 'cmkeao7u60020lw0wnez1kggn', step_number: 7, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768412395/portfolio/e9weqngsqofvz9z8qqyj.png', description: 'Add Technology. If a technology is missing, it can be added to the database using the plus button.' },
      { id: 'cmkeb6esc002glw0wvqpukx8a', manualId: 'cmkeao7u60020lw0wnez1kggn', step_number: 8, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768412555/portfolio/ezkzjb5u3glzj4j5milw.png', description: 'Update Project. Edit existing project details.' },
      { id: 'cmkeb9avj002ilw0w74jikd8j', manualId: 'cmkeao7u60020lw0wnez1kggn', step_number: 9, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768412690/portfolio/nzhx3hw2chmodvpaagp0.png', description: 'User Manuals. Each project has associated manuals. Only admins see all manuals. The active manual is visible to visitors.' },
      { id: 'cmkeb9xx0002klw0w93vtki3q', manualId: 'cmkeao7u60020lw0wnez1kggn', step_number: 10, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768412720/portfolio/fab4n5gv8rbj3wntbmoo.png', description: 'New User Manual. Click the plus button to create a new user manual for a project.' },
      { id: 'cmkebaj0r002mlw0w1dv9b3ro', manualId: 'cmkeao7u60020lw0wnez1kggn', step_number: 11, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768412747/portfolio/wtytcovmtghzcaphzlfz.png', description: 'Edit or Delete User Manual. Update or remove an existing user manual.' },
      { id: 'cmkebbmew002olw0wztodm43g', manualId: 'cmkeao7u60020lw0wnez1kggn', step_number: 12, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768412792/portfolio/wmi974h4df0w7r0rk9aq.png', description: 'Create Manual Step. Add a new step to a user manual.' },
      { id: 'cmkebc8te002qlw0wo3ifmw13', manualId: 'cmkeao7u60020lw0wnez1kggn', step_number: 13, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1768412827/portfolio/itbrdysa6fjzgq7jmvxc.png', description: 'Update Manual Step. Edit an existing manual step.' },
      // Yoga Path - main
      { id: 'cmmdoz5xv000qg30i6sefxinc', manualId: 'cmmdkiy5k000og30im165lf1y', step_number: 1, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1772728828/portfolio/ewl2stf7eu30kexurbx1.png', description: 'Home Page. Introduction to the app with an option to log in.' },
      { id: 'cmmdozx28000sg30iytn166lk', manualId: 'cmmdkiy5k000og30im165lf1y', step_number: 2, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1772728862/portfolio/q4sygkvtxfiq6xdmbnrp.png', description: 'Register Page. Create an account using a valid email and password. Emails are stored securely and never used.' },
      { id: 'cmmdp0l1p000ug30iek687tlx', manualId: 'cmmdkiy5k000og30im165lf1y', step_number: 3, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1772728896/portfolio/s9avawy0lwj8g76wemse.png', description: 'Login Page. Log in to access your profile, yoga recommendations, and practice log.' },
      { id: 'cmmdp1p8k000wg30i1myqsgh1', manualId: 'cmmdkiy5k000og30im165lf1y', step_number: 4, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1772728948/portfolio/stk17vluapn5hyhzxnv2.png', description: 'Dashboard. Overview of your profile, recommendations, and practice activity.' },
      { id: 'cmmdp2xb2000yg30iqdrj51ix', manualId: 'cmmdkiy5k000og30im165lf1y', step_number: 5, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1772729003/portfolio/n0w8kr2xmpvm60ksemoa.png', description: 'Profile Page. Set your weekly availability, yoga style preferences, and personal goals.' },
      { id: 'cmmdpc0uk0010g30i6c99nry5', manualId: 'cmmdkiy5k000og30im165lf1y', step_number: 6, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1772729429/portfolio/essrowek3bus6gyjqwqp.png', description: 'Recommendations Page. This page includes four sections:\n\nHealth Considerations (1) – reminders to share important health information with your yoga teacher.\nSession Breakdown (2) – suggested practice duration based on your availability and goals.\nRecommended Styles (3) – yoga styles that match your preferences and goals.\nBeyond the Mat (4) – additional wellness suggestions.' },
      { id: 'cmmdpe82e0012g30iqh66y2tx', manualId: 'cmmdkiy5k000og30im165lf1y', step_number: 7, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1772729531/portfolio/jiiwg6kelnndu3fdf65n.png', description: 'Generate Recommendations. If your profile is new or updated, you can generate new recommendations.' },
      { id: 'cmmdpg63f0014g30ivfwnrkvt', manualId: 'cmmdkiy5k000og30im165lf1y', step_number: 8, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1772729623/portfolio/jlckbodofdbuxor0cx0d.png', description: 'Recommendations History. Previous recommendations are saved in the history section at the bottom of the page.' },
      { id: 'cmmdph23s0016g30inmczl9w7', manualId: 'cmmdkiy5k000og30im165lf1y', step_number: 9, image_url: 'https://res.cloudinary.com/dojvyjghs/image/upload/v1772729665/portfolio/w4ztawbnmegavdekmhb1.png', description: 'Practice Log. Record your practice date, duration, and personal notes to track energy, health, and progress.' },
    ],
  });

  console.log('\n✅ Seed complete:');
  console.log(`   - 1 admin user (${adminEmail})`);
  console.log('   - 3 tech categories, 17 technologies');
  console.log('   - 5 projects, 26 tech-stack links');
  console.log('   - 6 manuals, 50 steps\n');
  if (!process.env.ADMIN_PASSWORD) {
    console.log('⚠️  ADMIN_PASSWORD not set — generated random:');
    console.log(`    ${adminPassword}`);
    console.log('    (Save it or re-run with ADMIN_PASSWORD env var.)\n');
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
