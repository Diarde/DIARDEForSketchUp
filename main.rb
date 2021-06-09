require 'sketchup.rb'


module Studiocinqo

  def self.create_wall(p1, p2, p3, p4, p5, p6, p7, p8, group)
    #model = Sketchup.active_model
    #model.start_operation('Create Wall', true)
    #group = model.active_entities.add_group
    #entities = model.active_entities #
    entities = group.entities
    points = [
      Geom::Point3d.new(p1[0].m, p1[1].m,  p1[2].m),
      Geom::Point3d.new(p2[0].m, p2[1].m,  p2[2].m),
      Geom::Point3d.new(p3[0].m, p3[1].m,  p3[2].m),
      Geom::Point3d.new(p4[0].m, p4[1].m,  p4[2].m)
    ]
    face = entities.add_face(points)
    points = [
      Geom::Point3d.new(p1[0].m, p1[1].m,  p1[2].m),
      Geom::Point3d.new(p2[0].m, p2[1].m,  p2[2].m),
      Geom::Point3d.new(p6[0].m, p6[1].m,  p6[2].m),
      Geom::Point3d.new(p5[0].m, p5[1].m,  p5[2].m)
    ]
    face = entities.add_face(points)
    points = [
      Geom::Point3d.new(p2[0].m, p2[1].m,  p2[2].m),
      Geom::Point3d.new(p3[0].m, p3[1].m,  p3[2].m),
      Geom::Point3d.new(p7[0].m, p7[1].m,  p7[2].m),
      Geom::Point3d.new(p6[0].m, p6[1].m,  p6[2].m)
    ]
    #face = entities.add_face(points)
    points = [
      Geom::Point3d.new(p3[0].m, p3[1].m,  p3[2].m),
      Geom::Point3d.new(p4[0].m, p4[1].m,  p4[2].m),
      Geom::Point3d.new(p8[0].m, p8[1].m,  p8[2].m),
      Geom::Point3d.new(p7[0].m, p7[1].m,  p7[2].m)
    ]
    face = entities.add_face(points)
    points = [
      Geom::Point3d.new(p4[0].m, p4[1].m,  p4[2].m),
      Geom::Point3d.new(p1[0].m, p1[1].m,  p1[2].m),
      Geom::Point3d.new(p5[0].m, p5[1].m,  p5[2].m),
      Geom::Point3d.new(p8[0].m, p8[1].m,  p8[2].m)
    ]
    #face = entities.add_face(points)
    points = [
      Geom::Point3d.new(p5[0].m, p5[1].m,  p5[2].m),
      Geom::Point3d.new(p6[0].m, p6[1].m,  p6[2].m),
      Geom::Point3d.new(p7[0].m, p7[1].m,  p7[2].m),
      Geom::Point3d.new(p8[0].m, p8[1].m,  p8[2].m)
    ]
    face = entities.add_face(points)
    #face.reverse!

    #model.commit_operation
  end

  def self.create_hole(p1, p2, p3, p4, group)
    #model = Sketchup.active_model
    #model.start_operation('Create hole', true)
    #group = model.active_entities.add_group
    #entities = model.active_entities #
    entities = group.entities
 
    points = [
      Geom::Point3d.new(p1[0].m, p1[1].m,  p1[2].m),
      Geom::Point3d.new(p2[0].m, p2[1].m,  p2[2].m),
      Geom::Point3d.new(p3[0].m, p3[1].m,  p3[2].m),
      Geom::Point3d.new(p4[0].m, p4[1].m,  p4[2].m)
    ] 
    face = entities.add_face(points)
    face.pushpull(0.15.m, false)
    #model.commit_operation
  end

  def self.create_floor(array, group)
    #model = Sketchup.active_model
    #model.start_operation('Create hole', true)
    #group = model.active_entities.add_group
    entities = group.entities
 
    points = array.map{|p|
      Geom::Point3d.new(p[0].m, p[1].m,  p[2].m)
    }
    face = entities.add_face(points)
    #model.commit_operation
  end

  # Better to create a command object.
  cmd = UI::Command.new("Diarde") {

    html_file = File.join(__dir__, 'html', 'index.html')
    options = {
      :dialog_title => "Diarde",
      :preferences_key => "example.htmldialog.materialinspector",
      :style => UI::HtmlDialog::STYLE_DIALOG,
      # Set a fixed size now that we know the content size.
      :resizable => false,
      :width => 950,
      :height => 630,
    }
    dialog = UI::HtmlDialog.new(options)
    dialog.set_size(options[:width], options[:height]) # Ensure size is set.
    #dialog.set_file(html_file)
    dialog.set_url('https://sketchup.diarde.com')
    dialog.center
    dialog.add_action_callback('accept') { |action_context, obj|  
      model = Sketchup.active_model
      model.start_operation('Create Wall', true)
      group = model.active_entities.add_group
      group.name = "walls"
      obj["faces"].each_with_index {|v, index| 
        face = v["face"];
        self.create_wall(face[0], face[1], face[2], face[3], face[4], face[5], face[6], face[7], group)
        windows = v["windows"]
        windows.each {|w| 
        if w.length == 4 then
          self.create_hole(w[0], w[1], w[2], w[3], group)
        end
        }
        doors = v["doors"]
        doors.each {|w| 
        if w.length == 4 then
          self.create_hole(w[0], w[1], w[2], w[3], group)
        end
        }}
      group = model.active_entities.add_group
      group.name = "floor"
      self.create_floor(obj["ground"], group)

      model.commit_operation
      dialog.close
    }

    dialog.show
  }
  cmd.menu_text = "Diarde"
 
  UI.menu("Plugins").add_item cmd

end