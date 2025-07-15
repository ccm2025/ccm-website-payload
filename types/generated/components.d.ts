import type { Schema, Struct } from '@strapi/strapi';

export interface AboutPageHistoryStory extends Struct.ComponentSchema {
  collectionName: 'components_about_page_history_stories';
  info: {
    displayName: 'History Story';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface AboutPageTeamMember extends Struct.ComponentSchema {
  collectionName: 'components_about_page_team_members';
  info: {
    displayName: 'Team Member';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'>;
    description: Schema.Attribute.Text;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface GatheringsPageCategory extends Struct.ComponentSchema {
  collectionName: 'components_gatherings_page_categories';
  info: {
    displayName: 'Category';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface GivePagePdfLink extends Struct.ComponentSchema {
  collectionName: 'components_give_page_pdf_links';
  info: {
    displayName: 'PDF Link';
  };
  attributes: {
    pdf: Schema.Attribute.Media<'files'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PlanYourVisitPageScheduleItem extends Struct.ComponentSchema {
  collectionName: 'components_plan_your_visit_page_schedule_items';
  info: {
    displayName: 'Schedule Item';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SupportPageInfoSection extends Struct.ComponentSchema {
  collectionName: 'components_support_page_info_sections';
  info: {
    displayName: 'Info Section';
  };
  attributes: {
    button_text: Schema.Attribute.String;
    button_url: Schema.Attribute.String;
    content: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about-page.history-story': AboutPageHistoryStory;
      'about-page.team-member': AboutPageTeamMember;
      'gatherings-page.category': GatheringsPageCategory;
      'give-page.pdf-link': GivePagePdfLink;
      'plan-your-visit-page.schedule-item': PlanYourVisitPageScheduleItem;
      'support-page.info-section': SupportPageInfoSection;
    }
  }
}
